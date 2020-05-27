import PROGRAM from "../ast/PROGRAM";
import { ComplexCommandParams } from "../App";
import { Filter, getSelectedDecks } from "../model/query";
import { Database } from "@nozbe/watermelondb";

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

export type FlashCard =
  | {
      front: string;
      back: string;
      deckName: string;
      attributes?: Array<{ attributeType: string; value: string }>;
    }
  | {
      front: string;
      back: string;
      deckId: string;
      attributes?: Array<{ attributeType: string; value: string }>;
    };

function getCardsFromDecksNoFilter(
  program,
  requestedDeckNames,
  isLimitAppliedToCards,
  limit
): SessionMaterials {
  // TODO
  return null;
}

async function getCardsFromDecks(
  db: Database,
  program: PROGRAM,
  requestedDeckNames: string[],
  filter?: Filter,
  isLimitAppliedToCards?: boolean,
  limit?: number
): Promise<SessionMaterials> {
  if (!filter) {
    return getCardsFromDecksNoFilter(
      program,
      requestedDeckNames,
      isLimitAppliedToCards,
      limit
    );
  } else {
    const decks = await getSelectedDecks(db, requestedDeckNames);
    // TODO
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

export type SessionMaterials = {
  deckNames?: string[];
  cards: FlashCard[];
};

/**
 * Returns the cards chosen by the user for their "Start session" command (in a promise)
 *
 * @param program
 * @param complexCommandParams
 * @returns a list of cards with front, back and deckName, maybe requiring an asynchronous stats fetch from the DB first
 */
export async function getCardsForSession(
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
