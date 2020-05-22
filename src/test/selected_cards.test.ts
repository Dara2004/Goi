import SELECTED_CARDS from "../ast/SELECTED_CARDS";
import Tokenizer from "../lib/tokenizer";
import * as constants from "../lib/constants";

test("selectedCards parse should parse if syntax is valid", () => {
  Tokenizer.makeTokenizer("worst cards from", constants.allTokens);
  let selectedCards = new SELECTED_CARDS();
  selectedCards.parse();
  expect(selectedCards.cardFilter).toEqual("worst");
});
