import { Database, Q } from "@nozbe/watermelondb";
import { TableName } from "./constants";
import Session from "./Session";
import Deck from "./Deck";
import Card from "./Card";
import Tag from "./Tag";
import { shuffle } from "../lib/utils";
import SessionCard from "./SessionCard";

export enum Filter {
  BEST = "best",
  WORST = "worst",
  RANDOM = "random",
  OLDEST = "oldest",
  NEWEST = "newest",
}

export async function getAllDecks(db: Database): Promise<Array<Deck>> {
  const decksCollection = db.collections.get(TableName.DECKS);
  return (await decksCollection.query().fetch()) as Array<Deck>;
}

export async function getSelectedDecks(
  db: Database,
  deckNames: Array<string>
): Promise<Array<Deck>> {
  const decksCollection = db.collections.get(TableName.DECKS);
  return (await decksCollection
    .query(Q.where("name", Q.oneOf(deckNames)))
    .fetch()) as Array<Deck>;
}

export async function getDeckNameFromID(
  db: Database,
  id: number
): Promise<string> {
  // TODO: Add caching
  const decksCollection = db.collections.get(TableName.DECKS);
  const decks = (await decksCollection
    .query(Q.where("id", id))
    .fetch()) as Array<Deck>;
  if (decks.length < 1) {
    throw new Error(`Unable to retrieve deck name for ID ${id}`);
  }
  return decks[0].name;
}

export async function getUniqueDeckNamesFromSessions(
  db: Database,
  session: Session
): Promise<Array<string>> {
  let deckIds = [];
  const cardsCollection = db.collections.get(TableName.CARDS);
  const sessionCards: Array<SessionCard> = (await session.cards) as Array<
    SessionCard
  >;
  for (let sessionCard of sessionCards) {
    const foundDeckIds = {}; // set
    let card = ((await cardsCollection
      .query(Q.where("id", sessionCard.card_id))
      .fetch()) as Array<Card>)[0];
    if (!foundDeckIds[card.deck_id]) {
      foundDeckIds[card.deck_id] = true;
      deckIds.push(card.deck_id);
    }
  }
  let deckNames: Array<string> = [];
  for (let deckId of deckIds) {
    deckNames.push(await getDeckNameFromID(db, deckId));
  }
  return deckNames;
}

export async function getCardsFromSelectedDecks(
  db: Database,
  deckNames: Array<string>
): Promise<Array<Card>> {
  let result = [];
  const decks = await getSelectedDecks(db, deckNames);
  for (let deckId of decks) {
    result = result.concat(await deckId.cards.fetch());
  }
  return result;
}

export async function getAllTags(db: Database): Promise<Array<Tag>> {
  const tagsCollection = db.collections.get(TableName.TAGS);
  return (await tagsCollection.query().fetch()) as Array<Tag>;
}

export async function getSelectedTags(
  db: Database,
  tagNames: Array<string>
): Promise<Array<Tag>> {
  const tagsCollection = db.collections.get(TableName.TAGS);
  return (await tagsCollection
    .query(Q.where("name", Q.oneOf(tagNames)))
    .fetch()) as Array<Tag>;
}

export async function getCardsFromSelectedTags(
  db: Database,
  tagNames: Array<string>
): Promise<Array<Card>> {
  let allCards: Array<Card> = [];
  const cardIds = new Set();
  const tags = await getSelectedTags(db, tagNames);

  for (const tag of tags) {
    const cards = await tag.cards;
    allCards.concat(cards as Array<Card>);
  }

  return uniqueCards(allCards);
}

export async function getAllSessions(db: Database): Promise<Array<Session>> {
  const sessionsCollection = db.collections.get(TableName.SESSIONS);
  return (await sessionsCollection.query().fetch()) as Array<Session>;
}

export async function getPastSessions(
  db: Database,
  n: number = 5
): Promise<Array<Session>> {
  const allSessions = await getAllSessions(db);
  return allSessions.sort((a, b) => b.started_at - a.started_at).slice(0, n);
}

export async function getCardsFromSelectedSessions(
  db: Database,
  n: number = 5
): Promise<Array<Card>> {
  let allCards: Array<Card> = [];
  const sessions = await getPastSessions(db, n);

  for (const session of sessions) {
    const cards = await session.cards;
    allCards.concat(cards as Array<Card>);
  }

  return uniqueCards(allCards);
}

export function cardFilter(
  cards: Array<Card>,
  filter: Filter,
  n: number = 1
): Array<Card> {
  let result = [];

  switch (filter) {
    case Filter.BEST:
      result = cards
        .sort((a, b) => b.right - b.wrong - (a.right - a.wrong))
        .slice(0, n);
      break;
    case Filter.WORST:
      result = cards
        .sort((a, b) => a.right - a.wrong - (b.right - b.wrong))
        .slice(0, n);
      break;
    case Filter.NEWEST:
      result = cards.sort((a, b) => a.created_at - b.created_at).slice(0, n);
      break;
    case Filter.OLDEST:
      result = cards.sort((a, b) => b.created_at - a.created_at).slice(0, n);
      break;
    case Filter.RANDOM:
      result = shuffle(cards).slice(0, n);
      break;
    default:
      throw new Error(`Unknown CARD_MODIFIER: ${filter}`);
  }

  return result;
}

export async function deckFilter(
  decks: Array<Deck>,
  filter: Filter,
  n: number = 1
): Promise<Array<Deck>> {
  let result = [];
  let deckScoreMap = new Map();
  for (let deck of decks) {
    const cards = await deck.cards.fetch();
    const score = calculateDeckScore(cards);
    deckScoreMap.set(deck.id, score);
  }

  switch (filter) {
    case Filter.BEST:
      result = decks
        .sort((a, b) => deckScoreMap.get(b.id) - deckScoreMap.get(a.id))
        .slice(0, n);
      break;
    case Filter.WORST:
      result = decks
        .sort((a, b) => deckScoreMap.get(a.id) - deckScoreMap.get(b.id))
        .slice(0, n);
      break;
    case Filter.NEWEST:
      result = decks.sort((a, b) => a.created_at - b.created_at).slice(0, n);
      break;
    case Filter.OLDEST:
      result = decks.sort((a, b) => b.created_at - a.created_at).slice(0, n);
      break;
    case Filter.RANDOM:
      result = shuffle(decks).slice(0, n);
      break;
    default:
      throw new Error(`Unknown CARD_MODIFIER: ${filter}`);
  }

  return result;
}

export async function sessionFilter(
  db: Database,
  sessions: Array<Session>,
  filter: Filter,
  n: number = 1
): Promise<Array<Session>> {
  let result = [];
  let sessionsScoreMap = new Map();

  for (const session of sessions) {
    const score = await getSessionScore(db, session);
    sessionsScoreMap.set(session.id, score);
  }

  switch (filter) {
    case Filter.BEST:
      result.sort(
        (a, b) =>
          sessionsScoreMap.get(b.id) - sessionsScoreMap.get(a.id).slice(0, n)
      );
      break;
    case Filter.WORST:
      result
        .sort((a, b) => sessionsScoreMap.get(a.id) - sessionsScoreMap.get(b.id))
        .slice(0, n);
      break;
    case Filter.NEWEST:
      result = sessions.sort((a, b) => a.started_at - b.started_at).slice(0, n);
      break;
    case Filter.OLDEST:
      result = sessions.sort((a, b) => b.started_at - a.started_at).slice(0, n);
      break;
    case Filter.RANDOM:
      result = shuffle(sessions).slice(0, n);
      break;
    default:
      throw new Error(`Unknown CARD_MODIFIER: ${filter}`);
  }

  return result;
}

export function calculateDeckScore(cards: Array<Card>): number {
  let rightCount = 0;
  let wrongCount = 0;
  cards.forEach((card) => {
    rightCount += card.right;
    wrongCount += card.wrong;
  });
  return rightCount / (rightCount + wrongCount);
}

export async function getSessionScore(
  db: Database,
  session: Session
): Promise<number> {
  const sessionCardsCollection = db.collections.get(TableName.SESSIONS_CARDS);
  const sessionCards = (await sessionCardsCollection
    .query(Q.where("session_id", session.id))
    .fetch()) as Array<SessionCard>;
  const totalCards = sessionCards.length;
  return sessionCards.map((sc) => sc.is_correct).length / totalCards;
}

export function uniqueCards(cards: Array<Card>): Array<Card> {
  let result = [];
  const cardIds = new Set();
  for (const card of cards) {
    if (!cardIds.has(card.id)) {
      result.push(card);
      cardIds.add(card.id);
    }
  }
  return result;
}
