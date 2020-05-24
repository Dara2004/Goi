import PROGRAM from "../ast/PROGRAM";
import guess, { GuessType, Guess } from "./guesser";
import { Database, Q } from "@nozbe/watermelondb";
import { TableName } from "../model/constants";
import Deck from "../model/Deck";
import { debugDB } from "./utils";
import Card from "../model/Card";

async function updateDeckName(oldName: string, newName: string, db: Database) {
  debugDB(`Attempting to update deck name ${oldName} -> ${newName}`);
  try {
    const decks = db.collections.get(TableName.DECKS);
    await db.action(async () => {
      const q = decks.query(Q.where("name", Q.eq(oldName)));
      const foundDecks = (await decks.fetchQuery(q)) as Deck[];
      if (foundDecks.length === 1) {
        const oldDeck = foundDecks[0];
        await oldDeck.update((deck) => {
          deck.name = newName;
        });
        debugDB(`Success! Updated deck name ${oldName} -> ${newName}`);
      } else {
        throw new Error(
          `reconciler::updateDeckName -- found ${foundDecks.length} decks with the name ${oldName}!`
        );
      }
    });
  } catch (err) {
    debugDB(err);
  }
}

async function createOrUpdateCard(guess: Guess, db: Database): Promise<void> {
  if (
    guess.type !== GuessType.UpdateCardFront &&
    guess.type !== GuessType.UpdateCardBack &&
    guess.type !== GuessType.CreateCard
  ) {
    debugDB("Unexpected input to reconciler::createOrUpdateCard");
    return;
  }
  debugDB(`Attempting to create or update card in deck ${guess.deckName}`);

  try {
    const decks = db.collections.get(TableName.DECKS);

    await db.action(async () => {
      const decksQ = decks.query(Q.where("name", Q.eq(guess.deckName)));
      const foundDecks = (await decks.fetchQuery(decksQ)) as Deck[];
      if (foundDecks.length === 1) {
        debugDB(`Corresponding deck found!`);
        const deck = foundDecks[0];
        if (guess.type === GuessType.CreateCard) {
          debugDB(
            `Attempting to add new card. Front: ${guess.front} | Back: ${guess.back}`
          );
          await deck.addCard(guess.front, guess.back);
          debugDB(
            `Successfully added card! Front: ${guess.front} | Back: ${guess.back}`
          );
          return;
        }

        // Update card front or back
        const cards = db.collections.get(TableName.CARDS);
        if (guess.type === GuessType.UpdateCardFront) {
          const cardsQ = cards.query(
            Q.where("back", Q.eq(guess.back)),
            Q.where("front", Q.eq(guess.oldFront)),
            Q.where("deck_id", Q.eq(deck.id))
          );
          const foundCards = (await cards.fetchQuery(cardsQ)) as Card[];
          if (foundCards.length === 1) {
            debugDB(`Corresponding card found!`);
            const card = foundCards[0];
            await card.update((card) => {
              card.front = guess.newFront;
            });
            debugDB(`Successfully updated card front!`);
          } else {
            throw new Error(
              `reconciler::createOrUpdateCard -- found ${foundCards.length} cards with the same deck, front and back when attempting to update card!`
            );
          }
        } else if (guess.type === GuessType.UpdateCardBack) {
          const cardsQ = cards.query(
            Q.where("back", Q.eq(guess.oldBack)),
            Q.where("front", Q.eq(guess.front)),
            Q.where("deck_id", Q.eq(deck.id))
          );
          const foundCards = (await cards.fetchQuery(cardsQ)) as Card[];
          if (foundCards.length === 1) {
            debugDB(`Corresponding card found!`);
            const card = foundCards[0];
            await card.update((card) => {
              card.back = guess.newBack;
            });
            debugDB(`Successfully updated card back!`);
          } else {
            throw new Error(
              `reconciler::createOrUpdateCard -- found ${foundCards.length} cards with the same deck, front and back when attempting to update card!`
            );
          }
        }
      } else {
        throw new Error(
          `reconciler::createOrUpdateCard -- found ${foundDecks.length} decks with the name ${guess.deckName}!`
        );
      }
    });
  } catch (err) {
    debugDB("createOrUpdateCard", err);
  }
}

async function createDeck(deckName: string, db: Database): Promise<void> {
  debugDB(`Attempting to create new deck: ${deckName}`);
  debugDB(`Searching for existence of ${deckName}`);
  // Check if there is a deck with this name
  try {
    const decks = db.collections.get(TableName.DECKS);
    await db.action(async () => {
      const q = decks.query(Q.where("name", Q.eq(deckName)));
      const count = await decks.fetchCount(q);
      if (count === 1) {
        debugDB(`DB already has this deck, so not going to add it`);
        return;
      }
      if (count > 1) {
        debugDB(`DB has ${count} decks with this name already`);
        return;
      }
      debugDB(`Found 0 decks with this name.`);
      await decks.create((deck: Deck) => {
        deck.name = deckName;
      });
      debugDB(`Successfully created new deck: ${deckName}!`);
    });
  } catch (err) {
    debugDB("createDeck", err);
  }
}

// Handles background CRUD as a result of card editor changes
export default async function reconcile(
  prev: PROGRAM,
  curr: PROGRAM,
  db: Database
): Promise<void> {
  const guessedAction = guess(prev, curr);

  switch (guessedAction.type) {
    case GuessType.Nothing:
    case GuessType.Delete:
      return;
    case GuessType.UpdateDeckName:
      const { oldDeckName, newDeckName } = guessedAction;
      await updateDeckName(oldDeckName, newDeckName, db);
      return;
    case GuessType.UpdateCardFront:
    case GuessType.UpdateCardBack:
    case GuessType.CreateCard:
      await createOrUpdateCard(guessedAction, db);
      return;
    case GuessType.CreateDeck:
      await createDeck(guessedAction.deckName, db);
      return;
    case GuessType.CopyPasteSingleDeck:
    // TODO
    case GuessType.CopyPasteMultiDecks:
    // TODO
  }
}
