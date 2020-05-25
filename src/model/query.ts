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

export async function getCardsFromSelectedDecks(
  db: Database,
  deckNames: Array<string>
): Promise<Array<Card>> {
  let result = [];
  const decks = await getSelectedDecks(db, deckNames);
  decks.forEach((deck) => result.concat(deck.cards));
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
  return allSessions.sort((a, b) => b.created_at - a.created_at).slice(0, n);
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

export function deckFilter(
  decks: Array<Deck>,
  filter: Filter,
  n: number = 1
): Array<Deck> {
  let result = [];

  switch (filter) {
    case Filter.BEST:
      result = decks
        .sort((a, b) => getDeckScore(b) - getDeckScore(a))
        .slice(0, n);
      break;
    case Filter.WORST:
      result = decks
        .sort((a, b) => getDeckScore(a) - getDeckScore(b))
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

export function sessionFilter(
  sessions: Array<Session>,
  scores: Array<number>,
  filter: Filter,
  n: number = 1
): Array<Session> {
  let result = [];

  let temp = sessions.map((session, idx) => ({
    session: session,
    score: scores[idx],
  }));
  switch (filter) {
    case Filter.BEST:
      temp.sort((a, b) => b.score - a.score).slice(0, n);
      result = temp.map((item) => item.session).slice(0, n);
      break;
    case Filter.WORST:
      temp.sort((a, b) => a.score - b.score).slice(0, n);
      result = temp.map((item) => item.session).slice(0, n);
      break;
    case Filter.NEWEST:
      result = sessions.sort((a, b) => a.created_at - b.created_at).slice(0, n);
      break;
    case Filter.OLDEST:
      result = sessions.sort((a, b) => b.created_at - a.created_at).slice(0, n);
      break;
    case Filter.RANDOM:
      result = shuffle(sessions).slice(0, n);
      break;
    default:
      throw new Error(`Unknown CARD_MODIFIER: ${filter}`);
  }

  return result;
}

function getDeckScore(deck: Deck): number {
  let result = 0;
  deck.cards.forEach((card) => (result += card.right - card.wrong));
  return result;
}

export async function getSessionScore(
  db: Database,
  session: Session
): Promise<number> {
  const sessionCardsCollection = db.collections.get(TableName.SESSIONS_CARDS);
  const sessionCards = (await sessionCardsCollection
    .query(Q.where("session_id", session.id))
    .fetch()) as Array<SessionCard>;
  return sessionCards.map((sc) => sc.is_correct).length;
}

function uniqueCards(cards: Array<Card>): Array<Card> {
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
