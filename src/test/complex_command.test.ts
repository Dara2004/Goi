import Tokenizer from "../lib/tokenizer";
import START_SESSION from "../ast/START_SESSION";
import SHOW from "../ast/SHOW";
import COMPLEX_COMMAND from "../ast/COMPLEX_COMMAND";
import * as constants from "../lib/constants";

test("complexCommand parse should parse show branch correctly", () => {
  Tokenizer.makeTokenizer(
    "Show stats for 5 worst cards from Decks: French",
    constants.allTokens
  );
  let complexCommand = new COMPLEX_COMMAND();
  complexCommand.parse();

  expect(complexCommand.subjectModfier).toBeInstanceOf(SHOW);
});

test("complexCommand parse should start session branch correctly", () => {
  Tokenizer.makeTokenizer(
    "Start Session from 5 worst cards from Decks: French",
    constants.allTokens
  );
  let complexCommand = new COMPLEX_COMMAND();
  complexCommand.parse();

  Tokenizer.makeTokenizer(
    "Show stats for 5 worst cards from Decks: French",
    constants.allTokens
  );
  expect(complexCommand.subjectModfier).toBeInstanceOf(START_SESSION);
});
