import PROGRAM from "../ast/PROGRAM";
import { ComplexCommandParams } from "../App";
import { Filter, getSelectedDecks, deckFilter } from "../model/query";
import { Database } from "@nozbe/watermelondb";
import { SessionMaterials } from "../components/Session";
import { randomize } from "./utils";
import FILTER from "../ast/FILTER";
import CREATE_DECK from "../ast/CREATE_DECK";
import CARD from "../ast/CARD";
import { TableName } from "../model/constants";

type SessionCommandError = {
  message: string;
};

const deckSelectionErrorMessage =
  "Please select one of the decks on the card editor";

/**
 * Checks whether the user's complex command makes sense (currently checks the deck names), add more logic here
 *
 * @returns either false if there's no error, or an error message
 */
export function checkSessionCommandError(
  program: PROGRAM,
  complexCommandParams: ComplexCommandParams
): SessionCommandError | false {
  const { subject, deckNames: requestedDeckNames } = complexCommandParams;
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
  }

  // Add more checks here as we add features, for instance, of tags

  return false;
}

export type FlashCard = {
  front: string;
  back: string;
  deckName: string;
};

/*
 * Returns a list of case sensitive deck names matching the requested deck names, removing duplicates
 */

function getValidDeckNames(
  program: PROGRAM,
  requestedDeckNames: string[]
): string[] {
  const validDeckNames = {}; // mapping of actual (case sensitive) deck name -> boolean (i.e. a set of case sensitive deck names)
  const deckNamesInProgram = {}; // mapping of lower case name -> case sensitive name
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
  let selectedCards = [];
  for (const cd of selectedCreateDecks) {
    const deckName = cd.name;
    for (const card of cd.deck.cards) {
      const cardWithDeck = { ...card, deckName };
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
  const selectedCardsSet = {}; // selectedCards.deckName:front:back -> bool
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
    const filteredDecksSet = {}; // deckName -> boolean
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

async function getCardsFromSessions(
  filter?: Filter,
  isLimitAppliedToCards?: boolean,
  limit?: number
) {
  const flashCards: FlashCard[] = [];
  if (!filter && !limit) {
  }
  return flashCards;
}

/**
 * Returns the cards chosen by the user for their "Start session" command (in a promise)
 *
 * @returns a list of cards with front, back and deckName, maybe requiring an asynchronous stats fetch from the DB first
 */
export async function getSessionMaterials(
  program: PROGRAM,
  complexCommandParams: ComplexCommandParams,
  db: Database
): Promise<SessionMaterials> {
  console.log(complexCommandParams);

  const {
    subject,
    filter,
    isLimitAppliedToCards,
    limit,
    deckNames: requestedDeckNames,
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
  } else if (subject === "sessions") {
    return null; // TODO
    // return getCardsFromSessions(filter, isLimitAppliedToCards, limit);
  } else {
    return null;
  }
}
