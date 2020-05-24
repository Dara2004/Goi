import PROGRAM from "../ast/PROGRAM";
import CREATE_DECK from "../ast/CREATE_DECK";
import CARD from "../ast/CARD";

export enum GuessType {
  CreateDeck = "create deck",
  CreateCard = "create card",
  UpdateDeckName = "update deck name",
  UpdateCardFront = "update card front",
  UpdateCardBack = "update card back",
  CopyPasteMultiDecks = "copy paste multi decks",
  CopyPasteSingleDeck = "copy paste single decks",
  Delete = "deleted something",
  Nothing = "nothing",
}

export type Guess =
  | {
      type: GuessType.CreateDeck;
      deckName: string;
    }
  | {
      type: GuessType.UpdateDeckName;
      oldDeckName: string;
      newDeckName: string;
    }
  | {
      type: GuessType.CreateCard;
      deckName: string;
      front: string;
      back: string;
    }
  | {
      type: GuessType.UpdateCardFront;
      deckName: string;
      oldFront: string;
      newFront: string;
      back: string;
    }
  | {
      type: GuessType.UpdateCardBack;
      deckName: string;
      front: string;
      oldBack: string;
      newBack: string;
    }
  | {
      type:
        | GuessType.CopyPasteMultiDecks // Massively create if doesn't exist
        | GuessType.Nothing
        | GuessType.Delete; // Do nothing
    }
  | {
      type: GuessType.CopyPasteSingleDeck;
      deckName: string;
    };

function guessNewDeck(oldDecks: CREATE_DECK[], newDecks: CREATE_DECK[]): Guess {
  // we have more new decks than old decks
  const oldDeckNames = {};
  oldDecks.forEach((od) => {
    oldDeckNames[od.name] = true;
  });
  const newDecksFound = [];
  newDecks.forEach((nd, idx) => {
    if (!oldDeckNames[nd.name]) {
      newDecksFound.push({ name: nd.name, idx });
    }
  });
  if (newDecksFound.length === 1) {
    const { name, idx } = newDecksFound[0];
    const hasCards = newDecks[idx].deck.cards?.length > 1;
    if (!hasCards) {
      return {
        type: GuessType.CreateDeck,
        deckName: name,
      };
    } else {
      return {
        // Gained some cards along with a new deck, so user must have copy pasted
        type: GuessType.CopyPasteSingleDeck,
        deckName: name,
      };
    }
  }
  // More than 1 new deck found

  return {
    type: GuessType.CopyPasteMultiDecks,
  };
}

// list1 and list2 have the same number of elements
function numberOfDifferingNames(
  list1: CREATE_DECK[],
  list2: CREATE_DECK[]
): number {
  return list1.reduce(
    (acc, deck1, i) => (deck1.name !== list2[i].name ? acc + 1 : acc),
    0
  );
}

function haveSameCards(deck1: CREATE_DECK, deck2: CREATE_DECK): boolean {
  if (deck1.deck?.cards?.length !== deck2.deck?.cards?.length) {
    return false;
  }
  if (deck1.deck?.cards == null || deck2.deck?.cards == null) {
    // only one is null or undefined so they are not the same deck
    return false;
  }

  // same length and neither is null undefined, so check the cards
  const cards1 = deck1.deck.cards;
  const cards2 = deck2.deck.cards;
  // attempt to find a difference
  return !cards1.find((c1, idx) => {
    const c2 = cards2[idx];
    return (
      c1.cardNumber !== c2.cardNumber ||
      c1.front !== c2.front ||
      c1.back !== c2.back
    );
  });
}

function guessPossiblyRenamedDeck(
  oldDecks: CREATE_DECK[],
  newDecks: CREATE_DECK[]
): Guess {
  // find index of deck with different name
  let idx = 0;
  while (idx < oldDecks.length) {
    if (oldDecks[idx].name !== newDecks[idx].name) {
      break;
    }
    ++idx;
  }

  // check if they have card differences
  const od = oldDecks[idx];
  const nd = newDecks[idx];

  if (haveSameCards(od, nd)) {
    return {
      type: GuessType.UpdateDeckName,
      oldDeckName: od.name,
      newDeckName: nd.name,
    };
  } else {
    return {
      // A new deck was copypasted and an old one was deleted but we don't care about deletion
      type: GuessType.CopyPasteSingleDeck,
      deckName: nd.name,
    };
  }
}

function compareDeckLengths(oldDecks: CREATE_DECK[], newDecks: CREATE_DECK[]) {
  let numDifferences = 0;
  let firstDifference = undefined;
  oldDecks.forEach((od, idx) => {
    const nd = newDecks[idx];
    if (od.deck?.cards?.length !== nd.deck?.cards?.length) {
      ++numDifferences;
      if (numDifferences === 1) {
        firstDifference = idx;
      }
    }
  });
  return { numDifferences, firstDifference };
}

function guessNewCard(
  oldCards: CARD[],
  updatedCards: CARD[],
  deckName: string
): Guess {
  const newCards: CARD[] = [];
  for (let i = 0; i < oldCards.length; ++i) {
    const { front, back } = oldCards[i];
    const uc = updatedCards[i];
    if (uc.front !== front || uc.back !== back) {
      newCards.push(uc);
    }
  }

  if (newCards.length === 0) {
    const { front, back } = updatedCards[updatedCards.length - 1];
    // the last card is the new card
    return {
      type: GuessType.CreateCard,
      deckName,
      front,
      back,
    };
  }

  if (newCards.length === 1) {
    const { front, back } = newCards[0];
    return {
      type: GuessType.CreateCard,
      deckName,
      front,
      back,
    };
  }

  // More than 1
  return {
    type: GuessType.CopyPasteSingleDeck,
    deckName,
  };
}

// oldDeckCards and newDeckCards don't have the same length but may individually be null or undefined
function guessCardActionInDeck(
  oldDeck: CREATE_DECK,
  newDeck: CREATE_DECK
): Guess {
  const oldDeckCards = oldDeck.deck?.cards;
  const newDeckCards = newDeck.deck?.cards;
  if (oldDeckCards == null) {
    return {
      type: GuessType.CopyPasteSingleDeck,
      deckName: newDeck.name,
    };
  }
  if (newDeckCards == null) {
    return {
      type: GuessType.Delete,
    };
  }
  // both exist
  if (oldDeckCards.length > newDeckCards.length) {
    // Unhandled edge case: random copy paste, can change this to type: CopyPasteSingleDeck
    return {
      type: GuessType.Delete,
    };
  } else {
    // newDeck has more cards
    if (newDeckCards.length === oldDeckCards.length + 1) {
      // exactly 1 new card. So compare the cards
      return guessNewCard(oldDeckCards, newDeckCards, oldDeck.name);
    } else {
      // More than 1 card added, so it was a copy paste
      return {
        type: GuessType.CopyPasteSingleDeck,
        deckName: newDeck.name,
      };
    }
  }
}

function guessCardUpdate(
  oldDecks: CREATE_DECK[],
  newDecks: CREATE_DECK[]
): Guess {
  let singleDifference: Guess = undefined; // stores the necessary information for a CRUD action
  for (let i = 0; i < oldDecks.length; ++i) {
    const oldCards = oldDecks[i].deck?.cards;
    const newCards = newDecks[i].deck?.cards;
    if (oldCards && newCards) {
      for (let j = 0; j < oldCards.length; ++j) {
        if (
          oldCards[j].front === newCards[j].front &&
          oldCards[j].back === newCards[j].back
        ) {
          continue;
        }
        if (
          oldCards[j].front === newCards[j].front &&
          oldCards[j].back !== newCards[j].back
        ) {
          if (singleDifference) {
            // Found 2 differences -- guess a copy paste
            return {
              type: GuessType.CopyPasteMultiDecks,
            };
          }

          singleDifference = {
            type: GuessType.UpdateCardBack,
            deckName: oldDecks[i].name,
            front: oldCards[j].front,
            oldBack: oldCards[j].back,
            newBack: newCards[j].back,
          };
        } else if (
          oldCards[j].front !== newCards[j].front &&
          oldCards[j].back === newCards[j].back
        ) {
          if (singleDifference) {
            // Found 2 differences -- guess a copy paste
            return {
              type: GuessType.CopyPasteMultiDecks,
            };
          }

          singleDifference = {
            type: GuessType.UpdateCardFront,
            deckName: oldDecks[i].name,
            oldFront: oldCards[j].front,
            newFront: newCards[j].front,
            back: oldCards[j].back,
          };
        } else {
          // guess copy paste
          return {
            type: GuessType.CopyPasteMultiDecks,
          };
        }
      }
    }
  }

  if (!singleDifference) {
    // User did nothing special, the ASTs are the same
    return {
      type: GuessType.Nothing,
    };
  }

  return singleDifference;
}

function guessCardAction(
  oldDecks: CREATE_DECK[],
  newDecks: CREATE_DECK[]
): Guess {
  const { numDifferences, firstDifference } = compareDeckLengths(
    oldDecks,
    newDecks
  );
  if (numDifferences > 1) {
    return {
      type: GuessType.CopyPasteMultiDecks,
    };
  }
  if (numDifferences === 1) {
    // Possible creation of new card
    const oldDeck = oldDecks[firstDifference];
    const newDeck = newDecks[firstDifference];
    return guessCardActionInDeck(oldDeck, newDeck);
  }

  // The decks have same length, so find the single difference if there is one
  return guessCardUpdate(oldDecks, newDecks);
}

/** Guess the user's CRUD action by comparing previous and current ASTs (`PROGRAM`)
 * - Allows DB to respond appropriately upon certain user actions in the editor such as a change in deck name,
 * which cannot be determined without analyzing the AST changes
 * - Worst case `O(c)` where `c` is the total number of cards
 * - `O(d)` where `d` is the total number of decks for cases where a deck has been renamed
 *
 * @param prev the previous `PROGRAM`
 * @param curr the newly parsed `PROGRAM` to reconcile against the previous
 * @returns a guess at what the user just did (change deck name, update card front, copy paste a chunk, etc),
 * containing enough information to appropriate CRUD commands (such as renaming deck rather than add all the
 * cards as new cards when no cards have changed)
 */
export default function guess(prev: PROGRAM, curr: PROGRAM): Guess {
  const oldDecks = prev.create_decks;
  const newDecks = curr.create_decks;
  if (oldDecks.length > newDecks.length) {
    return {
      type: GuessType.Delete,
    };
  }
  if (oldDecks.length < newDecks.length) {
    if (oldDecks.length === newDecks.length - 1) {
      return guessNewDeck(oldDecks, newDecks);
    } else {
      // More than 1 new deck
      return {
        type: GuessType.CopyPasteMultiDecks,
      };
    }
  }

  // equal deck counts
  const differingNames = numberOfDifferingNames(oldDecks, newDecks);
  if (differingNames > 1) {
    return {
      type: GuessType.CopyPasteMultiDecks,
    };
  }
  if (differingNames === 1) {
    return guessPossiblyRenamedDeck(oldDecks, newDecks);
  }

  // No difference in deck names, possibly CRUD on single card
  return guessCardAction(oldDecks, newDecks);
}
