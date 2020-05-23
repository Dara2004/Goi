import Tokenizer from "../lib/tokenizer";
import DECKS from "../ast/DECKS";
import * as constants from "../lib/constants";

test("decks parseInteractivePrompt should parse if syntax valid", () => {
  Tokenizer.makeTokenizer("Decks: 1, 2, test", constants.allTokens);
  let decks = new DECKS();
  decks.parseInteractivePrompt();
  const expectedArray = ["1", "2", "test"];
  expect(decks.decks).toHaveLength(3);
  expect(decks.decks).toEqual(expectedArray);
});
