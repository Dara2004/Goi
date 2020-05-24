import PROGRAM from "../ast/PROGRAM";
import guess, { GuessType, Guess } from "./guesser";
import { Database, Q } from "@nozbe/watermelondb";
import { TableName } from "../model/constants";
import Deck from "../model/Deck";
import { debugDB } from "./utils";
import Card from "../model/Card";
import CREATE_DECK from "../ast/CREATE_DECK";

async function updateDeckName(oldName: string, newName: string, db: Database) {
  debugDB(`Attempting to update deck name ${oldName} -> ${newName}`);
  try {
    const decks = db.collections.get(TableName.DECKS);
    await db.action(async () => {
      const foundDecks = (await decks
        .query(Q.where("name", Q.eq(oldName)))
        .fetch()) as Deck[];
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
      const foundDecks = (await decks
        .query(Q.where("name", Q.eq(guess.deckName)))
        .fetch()) as Deck[];
      if (foundDecks.length === 1) {
        debugDB(`Corresponding deck found!`);
        const deck = foundDecks[0];
        if (guess.type === GuessType.CreateCard) {
          debugDB(
            `Attempting to add new card. Front: ${guess.front} | Back: ${guess.back}`
          );
          // https://nozbe.github.io/WatermelonDB/Actions.html#calling-actions-from-actions
          await deck.subAction(() => deck.addCard(guess.front, guess.back));
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
          const foundCards = (await cardsQ.fetch()) as Card[];
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
          const foundCards = (await cardsQ.fetch()) as Card[];
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

// Note: handling GuessType.CreateDeck with createOrUpdateDeck instead
async function createDeck(deckName: string, db: Database): Promise<void> {
  debugDB(`Attempting to create new deck: ${deckName}`);
  debugDB(`Searching for existence of ${deckName}`);
  // Check if there is a deck with this name
  try {
    const decks = db.collections.get(TableName.DECKS);
    await db.action(async () => {
      const count = await decks
        .query(Q.where("name", Q.eq(deckName)))
        .fetchCount();
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

async function createOrUpdateEntireDeck(createDeck: CREATE_DECK, db: Database) {
  const name = createDeck.name;
  const cards = createDeck.deck?.cards;
  debugDB(`Reconciling entire deck ${name} with DB...`);
  try {
    const decks = db.collections.get(TableName.DECKS);
    await db.action(async () => {
      const foundDecks = (await decks
        .query(Q.where("name", Q.eq(name)))
        .fetch()) as Deck[];
      if (foundDecks.length === 0) {
        debugDB(`DB has no deck with this name. Creating...`);
        const newDeck = (await decks.create((deck: Deck) => {
          deck.name = name;
        })) as Deck;
        debugDB(`Created!`);
        if (cards) {
          for (const card of cards) {
            debugDB(
              `Creating new card (Front: ${card.front}, Back: ${card.back})`
            );
            // https://nozbe.github.io/WatermelonDB/Actions.html#calling-actions-from-actions
            await newDeck.subAction(() =>
              newDeck.addCard(card.front, card.back)
            );
          }
          debugDB(`Finished adding its cards to the DB!`);
        }
        debugDB(`Done adding deck ${name} to the DB!`);
        return;
      }
      if (foundDecks.length === 1) {
        debugDB(
          `Found 1 deck with this name already in the DB. Reconciling its cards now...`
        );
        const deck = foundDecks[0];
        if (cards) {
          const cardsCollection = db.collections.get(TableName.CARDS);
          for (const card of cards) {
            // Look for an identical card in the deck
            debugDB(
              `Looking for card in deck (Front: ${card.front}, Back: ${card.back})`
            );
            const cardsQ = cardsCollection.query(
              Q.where("deck_id", Q.eq(deck.id)),
              Q.where("front", Q.eq(card.front)),
              Q.where("back", Q.eq(card.back))
            );
            const count = await cardsQ.fetchCount();
            if (count === 1) {
              debugDB(
                `Card already exists in deck (Front: ${card.front}, Back: ${card.back})`
              );
              continue;
            }
            if (count > 1) {
              debugDB(
                `Unexpected: ${count} copies of card exists in deck (Front: ${card.front}, Back: ${card.back})`
              );
              continue;
            }
            // Look for a card in deck with the same front
            debugDB(`Not found. Looking for card with just same front...`);
            const cardFrontQ = cardsCollection.query(
              Q.where("deck_id", Q.eq(deck.id)),
              Q.where("front", Q.eq(card.front))
            );
            const cardsWithSameFront = await cardFrontQ.fetch();
            if (cardsWithSameFront.length === 0) {
              // Look for a card in deck with the same back
              debugDB(`Not found. Looking for card with same back...`);
              const cardBackQ = cardsCollection.query(
                Q.where("deck_id", Q.eq(deck.id)),
                Q.where("back", Q.eq(card.back))
              );
              const cardsWithSameBack = await cardBackQ.fetch();
              if (cardsWithSameBack.length === 0) {
                // Create a new card
                debugDB(
                  `Creating new card (Front: ${card.front}, Back: ${card.back})`
                );
                await deck.subAction(() => deck.addCard(card.front, card.back));
                debugDB(`Done creating new card.`);
                continue;
              }
              if (cardsWithSameBack.length === 1) {
                // Update its front
                const cardToUpdate = cardsWithSameBack[0];
                debugDB(
                  `Found a single card with matching back, so updating front.`
                );
                await cardToUpdate.update((c: Card) => {
                  c.front = card.front;
                });
                debugDB(`Done updating front of card.`);
                continue;
              }
              if (cardsWithSameBack.length > 1) {
                debugDB(
                  `Unexpected: found ${cardsWithSameBack.length} cards in deck have the same back (${card.back})`
                );
                continue;
              }
            }
            if (cardsWithSameFront.length === 1) {
              // Update its back
              const cardToUpdate = cardsWithSameFront[0];
              debugDB(
                `Found a single card with matching front, so updating back.`
              );
              await cardToUpdate.update((c: Card) => {
                c.back = card.back;
              });
              debugDB(`Done updating back of card.`);
              continue;
            }
            if (cardsWithSameFront.length > 1) {
              debugDB(
                `Unexpected: found ${cardsWithSameFront.length} cards in deck have the same front (${card.front})`
              );
              continue;
            }
          }
        }
      } else {
        throw new Error(`Found ${foundDecks.length} decks with the same name,`);
      }
    });
  } catch (err) {
    debugDB("createOrUpdateEntireDeck Error: ", err);
  }
}

async function createOrUpdateAllDecks(program: PROGRAM, db: Database) {
  debugDB("Beginning to process what is guessed to be a multi-deck copy paste");
  try {
    for (const cd of program.create_decks) {
      await createOrUpdateEntireDeck(cd, db);
    }
    debugDB(
      "Finished processing what is guessed to be a multi-deck copy paste!"
    );
  } catch (err) {
    debugDB("createOrUpdateAllDecks Error: ", err);
  }
}

/** Reconciles the newly parsed AST with the DB
 * - Takes the previous and current AST and issues background CRUD actions
 * - Enables preservation of stats during minor card or deck modifications
 *
 * @param prev the old AST, which should already be in the DB
 * @param curr the newly parsed AST
 * @param db WatermelonDB instance
 */
export default async function reconcile(
  prev: PROGRAM,
  curr: PROGRAM,
  db: Database
): Promise<void> {
  const guessedAction = guess(prev, curr);
  debugDB("Guessed action:", guessedAction);

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
    case GuessType.CopyPasteSingleDeck:
    case GuessType.CreateDeck:
      const { deckName } = guessedAction;
      const deck = curr.create_decks.find((cd) => cd.name === deckName);
      await createOrUpdateEntireDeck(deck, db);
      return;
    case GuessType.CopyPasteMultiDecks:
      await createOrUpdateAllDecks(curr, db);
      return;
  }
}
