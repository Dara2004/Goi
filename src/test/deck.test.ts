import Tokenizer from "../lib/tokenizer";
import DECK from "../ast/DECK";

test("deck parse should parse if syntax valid", () => {
  Tokenizer.makeTokenizer(
    "(1) Front of card:Back of card\n" +
      "(2) Front:Back\n" +
      "(3) Speak:Parler\n" +
      "(4) Hello:Bonjour",
    ["\\(", "\\)", ":"]
  );
  let deck = new DECK();
  deck.parse();
  const expectedCardNumberArray = [1, 2, 3, 4];
  expect(deck.cards).toHaveLength(4);
  expect(deck.cards.map((c) => c.cardNumber)).toEqual(expectedCardNumberArray);
});
