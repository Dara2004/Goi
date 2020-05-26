import guess, { GuessType, Guess } from "../lib/guesser";
import PROGRAM from "../ast/PROGRAM";
import CREATE_DECK from "../ast/CREATE_DECK";
import DECK from "../ast/DECK";
import CARD from "../ast/CARD";

const FRUITS = "fruits";
const BANANA_FRONT = "banana front";
const BANANA_BACK = "banana back";
const ORANGE_FRONT = "orange front";
const ORANGE_BACK = "orange back";
const VEGGIES = "veggies";
const LETTUCE_FRONT = "lettuce front";
const LETTUCE_BACK = "lettuce back";
const DAIRY = "dairy";
const MILK_FRONT = "milk front";
const MILK_BACK = "milk back";
const YOGURT_FRONT = "yogurt front";
const YOGURT_BACK = "yogurt back";
const CHEESE_FRONT = "cheese front";
const CHEESE_BACK = "cheese back";

function complexProgram(): PROGRAM {
  const prog = new PROGRAM();
  prog.create_decks = [];
  const cd1 = new CREATE_DECK();
  const cd2 = new CREATE_DECK();
  const cd3 = new CREATE_DECK();
  cd1.name = FRUITS;
  const fruitsDeck = new DECK();
  cd1.deck = fruitsDeck;
  const banana = new CARD();
  banana.cardNumber = 1;
  banana.front = BANANA_FRONT;
  banana.back = BANANA_BACK;
  const orange = new CARD();
  orange.cardNumber = 2;
  orange.front = ORANGE_FRONT;
  orange.back = ORANGE_BACK;
  fruitsDeck.cards = [banana, orange];

  cd2.name = VEGGIES;
  const veggiesDeck = new DECK();
  cd2.deck = veggiesDeck;
  const lettuce = new CARD();
  lettuce.cardNumber = 1;
  lettuce.front = LETTUCE_FRONT;
  lettuce.back = LETTUCE_BACK;
  veggiesDeck.cards = [lettuce];

  cd3.name = DAIRY;
  const dairyDeck = new DECK();
  cd3.deck = dairyDeck;
  const milk = new CARD();
  milk.cardNumber = 1;
  milk.front = MILK_FRONT;
  milk.back = MILK_BACK;
  const yogurt = new CARD();
  yogurt.cardNumber = 2;
  yogurt.front = YOGURT_FRONT;
  yogurt.back = YOGURT_BACK;
  const cheese = new CARD();
  cheese.cardNumber = 3;
  cheese.front = CHEESE_FRONT;
  cheese.back = CHEESE_BACK;
  dairyDeck.cards = [milk, yogurt, cheese];

  prog.create_decks = [cd1, cd2, cd3];
  return prog;
}

test("guesser should guess correctly if user made no change to PROGRAM", () => {
  // Very basic programs that are identical

  const prog1 = new PROGRAM();
  prog1.create_decks = [new CREATE_DECK()];

  const prog2 = new PROGRAM();
  prog2.create_decks = [new CREATE_DECK()];
  const expected: Guess = {
    type: GuessType.Nothing,
  };
  const actual = guess(prog1, prog2);

  expect(actual).toEqual(expected);

  // Complex programs that are identical
  const prog3 = complexProgram();
  const prog4 = complexProgram(); // always makes the same program

  const complexActual = guess(prog3, prog4);
  expect(complexActual).toEqual(expected);
});

test("guesser should guess a deck name change correctly", () => {
  // Changing name of first deck
  const prog1 = complexProgram();
  const prog2 = complexProgram();
  // Change prog2's deck name from "fruits" to "fruiticana";
  const newName = "fruiticana";
  prog2.create_decks[0].name = "fruiticana";
  const expected: Guess = {
    type: GuessType.UpdateDeckName,
    oldDeckName: FRUITS,
    newDeckName: newName,
  };
  const actual = guess(prog1, prog2);
  expect(actual).toEqual(expected);
});

test("guesser should guess a card front update correctly", () => {
  const prog1 = complexProgram();
  const prog2 = complexProgram();
  const newFront = "milk tea";
  prog2.create_decks[2].deck.cards[0].front = newFront;
  const expected: Guess = {
    type: GuessType.UpdateCardFront,
    deckName: DAIRY,
    back: MILK_BACK,
    oldFront: MILK_FRONT,
    newFront,
  };
  const actual = guess(prog1, prog2);
  expect(actual).toEqual(expected);
});

test("guesser should guess a card back update correctly", () => {
  console.log("CARD BACK UPDATE TEST");
  const prog1 = complexProgram();
  const prog2 = complexProgram();
  const newBack = "milk tea";
  prog2.create_decks[2].deck.cards[0].back = newBack;
  const expected: Guess = {
    type: GuessType.UpdateCardBack,
    deckName: DAIRY,
    front: MILK_FRONT,
    oldBack: MILK_BACK,
    newBack,
  };
  const actual = guess(prog1, prog2);
  expect(actual).toEqual(expected);
});

test("guesser should guess a copy paste correctly when a deck gets replaced by another", () => {
  const prog1 = complexProgram();
  const prog2 = complexProgram();
  const newDeckName = "some new deck";
  prog2.create_decks[0] = new CREATE_DECK();
  prog2.create_decks[0].name = newDeckName;
  prog2.create_decks[0].deck = new DECK();
  prog2.create_decks[0].deck.cards = [
    { front: "hello", back: "hello", cardNumber: 3 } as CARD,
  ];
  const expected: Guess = {
    type: GuessType.CopyPasteSingleDeck,
    deckName: newDeckName,
  };
  const actual = guess(prog1, prog2);
  expect(actual).toEqual(expected);
});

test("guesser should guess a massive copy paste correctly", () => {
  const oldProg = new PROGRAM();
  const newProg = complexProgram();
  oldProg.create_decks = [new CREATE_DECK()];
  const expected: Guess = {
    type: GuessType.CopyPasteMultiDecks,
  };
  const actual = guess(oldProg, newProg);
  expect(actual).toEqual(expected);
});

test("guesser should guess a card creation correctly if it's in the end of the deck", () => {
  const prog1 = complexProgram();
  const prog2 = complexProgram();
  const front = "front";
  const back = "back";
  prog2.create_decks[1].deck.cards.push({
    front,
    back,
    cardNumber: 99,
  } as CARD);
  const expected: Guess = {
    type: GuessType.CreateCard,
    deckName: VEGGIES,
    front,
    back,
  };
  const actual = guess(prog1, prog2);
  expect(actual).toEqual(expected);
});

// NOT IMPLEMENTED: guesser should guess a card creation correctly if it's in the middle of the deck
