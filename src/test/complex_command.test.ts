import Tokenizer from "../lib/tokenizer";
import START_SESSION from "../ast/START_SESSION";
import COMPLEX_COMMAND from "../ast/COMPLEX_COMMAND";
import SHOW from "../ast/SHOW";
import * as constants from "../lib/constants";

test("complexCommand parse should parse show branch correctly", () => {
  Tokenizer.makeTokenizer(
    "Show stats for 5 worst cards from Decks: French",
    constants.allTokens
  );
  let complexCommand = new COMPLEX_COMMAND();
  complexCommand.parse();
  expect(complexCommand.subjectModfier.limit).toEqual(5);
  expect(complexCommand.subjectModfier.selectCards).toEqual(true);
  expect(complexCommand.subjectModfier.filter).toEqual("worst");
  const parsedAction = complexCommand.subjectModfier.action;
  expect(parsedAction).toBeInstanceOf(SHOW);
});

test("complexCommand parse should parse start branch correctly", () => {
  Tokenizer.makeTokenizer(
    "Start Session from Decks: French",
    constants.allTokens
  );
  let complexCommand = new COMPLEX_COMMAND();
  complexCommand.parse();
  expect(complexCommand.subjectModfier.limit).toEqual(5);
  expect(complexCommand.subjectModfier.selectCards).toEqual(false);
  expect(complexCommand.subjectModfier.filter).toEqual("");
  const parsedAction = complexCommand.subjectModfier.action;
  expect(parsedAction).toBeInstanceOf(START_SESSION);
});
