import PROGRAM from "../ast/PROGRAM";
import { ComplexCommandParams } from "../App";
import {
  Filter,
  getSelectedDecks,
  deckFilter,
  getPastSessions,
  getAllSessions,
  sessionFilter,
  getCardsFromSelectedSessions,
  uniqueCards,
  cardFilter,
} from "../model/query";
import { Database, Collection } from "@nozbe/watermelondb";
import {
  SessionMaterials,
  FlashCard,
  SessionMaterialsWithTags,
  FlashCardWithTags,
} from "../components/Session";
import { randomize, shuffle } from "./utils";
import FILTER from "../ast/FILTER";
import CREATE_DECK from "../ast/CREATE_DECK";
import { TableName } from "../model/constants";
import Session from "../model/Session";
import Card from "../model/Card";
import Deck from "../model/Deck";
import { Q } from "@nozbe/watermelondb";

type SessionCommandError = {
  message: string;
};

const deckSelectionErrorMessage =
  "Please select one or more of the decks on the card editor";

const tagSelectionErrorMessage =
  "Please select one or more of the tags on the card editor";

/**
 * Checks whether the user's complex command makes sense (currently checks the deck names), add more logic here
 *
 * @returns either false if there's no error, or an error message
 */
export function checkSessionCommandError(
  program: PROGRAM,
  complexCommandParams: ComplexCommandParams
): SessionCommandError | false {
  const {
    subject,
    deckNames: requestedDeckNames,
    tagNames,
  } = complexCommandParams;

  if (subject === "decks") {
    if (!requestedDeckNames) {
      return {
        message: deckSelectionErrorMessage,
      };
    }
    const activeDeckNames = program.create_decks.map((cd) => cd.name);
    const matchedDeckNames = new Set<string>();
    requestedDeckNames.forEach((name) => {
      if (
        activeDeckNames.findIndex(
          (deckName) => name.toLowerCase() === deckName.toLowerCase()
        ) !== -1
      ) {
        matchedDeckNames.add(name);
      }
    });
    if (matchedDeckNames.size === 0) {
      return {
        message: deckSelectionErrorMessage,
      };
    }
  } else if (subject === "tags") {
    if (tagNames.length === 0) {
      return {
        message: tagSelectionErrorMessage,
      };
    }
    let possibleTags = [];
    program.create_decks.forEach((cd) => {
      cd.tags && cd.tags.tags.forEach((t) => possibleTags.push(t.tagName));
    });
    let giveError = false;
    tagNames.forEach((t) => {
      if (!possibleTags.includes(t)) {
        giveError = true;
      }
    });
    if (giveError) {
      return {
        message: tagSelectionErrorMessage,
      };
    }
  }

  // Add more checks here as we add features, for instance, of tags
  return false;
}

/*
 * Returns a list of case sensitive deck names matching the requested deck names, removing duplicates
 */

function getValidDeckNames(
  program: PROGRAM,
  requestedDeckNames: string[]
): string[] {
  const validDeckNames: { [key: string]: boolean } = {}; // a set
  const deckNamesInProgram: { [key: string]: string } = {}; // mapping of lower case name -> case sensitive name
  program.create_decks.forEach((cd) => {
    if (cd.deck?.cards?.length > 0) {
      deckNamesInProgram[cd.name.toLowerCase()] = cd.name;
    }
  });
  requestedDeckNames.forEach((dn) => {
    const actualDeckName = deckNamesInProgram[dn.toLowerCase()];
    if (actualDeckName) {
      validDeckNames[actualDeckName] = true;
    }
  });
  return Object.keys(validDeckNames);
}

function getCardsFromSelectedDecks(selectedCreateDecks: CREATE_DECK[]) {
  let selectedCards: FlashCard[] = [];
  for (const cd of selectedCreateDecks) {
    const deckName = cd.name;
    for (const card of cd.deck.cards) {
      const cardWithDeck = { front: card.front, back: card.back, deckName };
      selectedCards.push(cardWithDeck);
    }
  }
  return selectedCards;
}

async function getCardsFromDecksNoFilter(
  deckNames: string[],
  selectedCreateDecks: CREATE_DECK[],
  limit: number,
  isLimitAppliedToCards?: boolean
): Promise<SessionMaterials> {
  if (!isLimitAppliedToCards) {
    randomize(selectedCreateDecks);
    if (limit < selectedCreateDecks.length) {
      selectedCreateDecks.splice(limit);
    }
  }

  let selectedCards = getCardsFromSelectedDecks(selectedCreateDecks);

  selectedCards = randomize(selectedCards);
  if (isLimitAppliedToCards) {
    randomize(selectedCards);
    if (limit < selectedCards.length) {
      selectedCards.splice(limit);
    }
  }
  return {
    deckNames: deckNames,
    cards: selectedCards,
  };
}

type CardWithStats = {
  front: string;
  back: string;
  deckName: string;
  right: number;
  wrong: number;
  createdAt: number; // UNIX timestamp
};

async function getCardStatsFromDB(
  db: Database,
  deckNames: string[],
  selectedCards: FlashCard[]
): Promise<CardWithStats[]> {
  const selectedCardsSet: { [key: string]: boolean } = {}; // selectedCards.deckName:front:back
  selectedCards.forEach(({ deckName, front, back }) => {
    selectedCardsSet[`${deckName}:${front}:${back}`] = true;
  });

  const cardsWithStats: CardWithStats[] = [];

  const decks = await getSelectedDecks(db, deckNames);
  for (const deck of decks) {
    const cardsFromDB = await deck.cards.fetch();
    cardsFromDB.forEach(
      ({ front, back, right, wrong, created_at: createdAt }) => {
        if (selectedCardsSet[`${deck.name}:${front}:${back}`]) {
          // take its stats
          cardsWithStats.push({
            deckName: deck.name,
            front,
            back,
            right,
            wrong,
            createdAt,
          });
        }
      }
    );
  }
  return cardsWithStats;
}

async function getCardsFromDecksWithFilter(
  db: Database,
  validDeckNames: string[],
  selectedCreateDecks: CREATE_DECK[],
  filter: Filter,
  limit: number,
  isLimitAppliedToCards?: boolean
): Promise<SessionMaterials> {
  // if limit is not less than what's available in selectedCreateDecks, directly return it without DB trip
  let selectedCards = getCardsFromSelectedDecks(selectedCreateDecks);
  randomize(selectedCards);
  if (!isLimitAppliedToCards) {
    if (limit >= selectedCreateDecks.length) {
      return {
        deckNames: validDeckNames,
        cards: selectedCards,
      };
    }
  } else {
    if (limit >= selectedCards.length) {
      return {
        deckNames: validDeckNames,
        cards: selectedCards,
      };
    }
  }
  //if  limit is less than what's available
  if (isLimitAppliedToCards) {
    const cardsWithStats = await getCardStatsFromDB(
      db,
      validDeckNames,
      selectedCards
    );
    switch (filter) {
      case Filter.BEST: {
        cardsWithStats.sort((card1, card2) => {
          return -(card1.right - card1.wrong - (card2.right - card2.wrong));
        });
      }
      case Filter.WORST: {
        cardsWithStats.sort((card1, card2) => {
          return card1.right - card1.wrong - (card2.right - card2.wrong);
        });
      }
      case Filter.OLDEST: {
        cardsWithStats.sort((card1, card2) => {
          return card1.createdAt - card2.createdAt;
        });
      }
      case Filter.NEWEST: {
        cardsWithStats.sort((card1, card2) => {
          return -(card1.createdAt - card2.createdAt);
        });
      }
    }
    cardsWithStats.splice(limit);
    randomize(cardsWithStats);
    return {
      deckNames: validDeckNames,
      cards: cardsWithStats,
    };
  } else {
    // e.g. best 5 decks
    const decksFromDB = await getSelectedDecks(db, validDeckNames);
    const filteredDecks = await deckFilter(decksFromDB, filter, limit);
    const filteredDecksSet: { [key: string]: boolean } = {};
    filteredDecks.forEach((deck) => {
      filteredDecksSet[deck.name] = true;
    });
    const filteredCreateDecks = selectedCreateDecks.filter(
      (cd) => filteredDecksSet[cd.name]
    );
    const cards = getCardsFromSelectedDecks(filteredCreateDecks);
    randomize(cards);
    return {
      deckNames: validDeckNames,
      cards: cards,
    };
  }
}

async function getCardsFromDecks(
  db: Database,
  program: PROGRAM,
  requestedDeckNames: string[],
  filter?: Filter,
  isLimitAppliedToCards?: boolean,
  limit: number = 5
): Promise<SessionMaterials> {
  const validDeckNames = getValidDeckNames(program, requestedDeckNames);
  const selectedCreateDecks = program.create_decks.filter((cd) => {
    return validDeckNames.includes(cd.name);
  });

  if (!filter || filter === Filter.RANDOM) {
    return getCardsFromDecksNoFilter(
      validDeckNames,
      selectedCreateDecks,
      limit,
      isLimitAppliedToCards
    );
  } else {
    return await getCardsFromDecksWithFilter(
      db,
      validDeckNames,
      selectedCreateDecks,
      filter,
      limit,
      isLimitAppliedToCards
    );
  }
}

async function getCardsFromTags(
  db: Database,
  program: PROGRAM,
  tagNames: string[],
  filter?: Filter,
  isLimitAppliedToCards?: boolean,
  limit?: number
): Promise<SessionMaterials> {
  const selectedCreateDecks = program.create_decks.filter((cd) => {
    const createDeckTags = cd.tags && cd.tags.tags.map((t) => t.tagName);
    let hasASelectedTag = false;
    if (createDeckTags) {
      createDeckTags.forEach((t) => {
        if (tagNames.includes(t)) {
          hasASelectedTag = true;
        }
      });
    }
    return hasASelectedTag;
  });
  // TODO implement filtering for tags
  const deckNames = selectedCreateDecks.map((cd) => cd.name);
  return await getCardsFromDecksNoFilter(
    deckNames,
    selectedCreateDecks,
    limit,
    isLimitAppliedToCards
  );
}

async function getCardsFromSessions(
  db: Database,
  filter?: Filter,
  isLimitAppliedToCards?: boolean,
  limit: number = 5
): Promise<SessionMaterials> {
  let sessions: Session[];

  if (isLimitAppliedToCards) {
    sessions = await getAllSessions(db);
  } else {
    if (filter) {
      sessions = await getAllSessions(db);
      sessions = await sessionFilter(db, sessions, filter, limit);
    } else {
      sessions = await getPastSessions(db, limit);
    }
  }

  let cards: Array<Card> = [];
  for (const session of sessions) {
    const cards = await session.cards;
    cards.concat(cards as Array<Card>);
  }

  cards = uniqueCards(cards);

  if (isLimitAppliedToCards && cards.length > limit) {
    if (filter) {
      cards = cardFilter(cards, filter, limit);
    } else {
      cards = shuffle(cards).splice(limit);
    }
  }

  shuffle(cards);

  const decks: Collection<Deck> = db.collections.get(TableName.DECKS);
  const deckIdToDeckName: { [key: string]: string } = {}; // deck id -> deck name (watermelonDB ids are strings)
  const flashCards: FlashCard[] = [];
  for (const card of cards) {
    if (!deckIdToDeckName[card.deck_id]) {
      deckIdToDeckName[card.deck_id] = (
        await decks.query(Q.where("id", Q.eq(card.deck_id))).fetch()
      )[0].name;
    }
    const deckName = deckIdToDeckName[card.deck_id];
    flashCards.push({
      deckName,
      front: card.front,
      back: card.back,
    });
  }

  return { cards: flashCards };
}

function addTagsToFlashCard(program: PROGRAM, card: FlashCard) {
  const cd: CREATE_DECK = program.create_decks.find(
    (cd) => cd.name === card.deckName
  );
  card.tags = cd.tags && cd.tags.tags.map((t) => t && t.tagName);
  card.attributes =
    cd.attributes &&
    cd.attributes.attributes.map((a) => {
      return a
        ? {
            attributeType: a.attribute.attributeType,
            value: a.attribute.value,
          }
        : null;
    });
}

/**
 * Returns the necessary information to start a session
 * (Currently not implementing tags with filtering)
 */
export async function getSessionMaterialsWithTags(
  program: PROGRAM,
  complexCommandParams: ComplexCommandParams,
  db: Database
): Promise<SessionMaterialsWithTags> {
  const sessionMaterials = await getSessionMaterials(
    program,
    complexCommandParams,
    db
  );
  sessionMaterials.cards.forEach((flashCard) => {
    return addTagsToFlashCard(program, flashCard);
  });

  // Bug fix to remove filtered out deckNames (replaces sessionMaterials.deckNames with filtered deck names)
  if (sessionMaterials.deckNames) {
    const filteredDeckNamesSet: { [key: string]: boolean } = {};
    sessionMaterials.cards.forEach((card) => {
      filteredDeckNamesSet[card.deckName] = true;
    });
    // set sessionMaterials.deckNames
    sessionMaterials.deckNames = Object.keys(filteredDeckNamesSet);
  }

  return sessionMaterials as SessionMaterialsWithTags;
}

// Do not export (use getSessionMaterialsWithTags instead)
async function getSessionMaterials(
  program: PROGRAM,
  complexCommandParams: ComplexCommandParams,
  db: Database
): Promise<SessionMaterials> {
  const {
    subject,
    filter,
    isLimitAppliedToCards,
    limit,
    deckNames: requestedDeckNames,
    tagNames,
  } = complexCommandParams;

  if (subject === "decks") {
    return await getCardsFromDecks(
      db,
      program,
      requestedDeckNames,
      filter,
      isLimitAppliedToCards,
      limit
    );
  } else if (subject === "tags") {
    return await getCardsFromTags(
      db,
      program,
      tagNames,
      filter,
      isLimitAppliedToCards,
      limit
    );
  } else if (subject === "sessions") {
    return await getCardsFromSessions(db, filter, isLimitAppliedToCards, limit);
  } else {
    throw new Error("Not supported!");
  }
}
