import Tokenizer from "../lib/tokenizer";
import CARD from "../ast/CARD";

test("card parse should parse if syntax valid", () => {
  Tokenizer.makeTokenizer("(1) Front of the card:Back of the card", [
    "\\(",
    "\\)",
    ":",
  ]);
  let card = new CARD();
  card.parse();
  expect(card.cardNumber).toEqual(1);
  expect(card.front).toEqual("Front of the card");
  expect(card.back).toEqual("Back of the card");
});
