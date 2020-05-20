import Tokenizer from "../lib/tokenizer";
import START_SESSION from "../ast/START_SESSION";
import SELECTED_CARDS from "../ast/SELECTED_CARDS";
import * as constants from "../lib/constants";

test("startSession parse should parse 'with cards from' branch if syntax is valid", () => {
  Tokenizer.makeTokenizer(
    "Start Session from oldest cards from",
    constants.allTokens
  );
  let startSession = new START_SESSION();
  startSession.parse();
  let expectedSelectedCards = new SELECTED_CARDS();
  expectedSelectedCards.cardFilter = "oldest";
  expect(startSession.selectedCards).toEqual(expectedSelectedCards);
});

test("startSession parse should parse 'with no selected cards' branch if syntax is valid", () => {
  Tokenizer.makeTokenizer("Start Session from", constants.allTokens);
  let startSession = new START_SESSION();
  startSession.parse();
  expect(startSession.selectedCards).toEqual(null);
});
