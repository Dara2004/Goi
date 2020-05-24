import Tokenizer from "../lib/tokenizer";
import START_SESSION from "../ast/START_SESSION";
import SHOW from "../ast/SHOW";
import SUBJECT_MODIFIER from "../ast/SUBJECT_MODIFIER";
import * as constants from "../lib/constants";

test("complexCommand parse should parse show branch correctly", () => {
  Tokenizer.makeTokenizer(
    "Show stats for 5 worst cards from Decks: French",
    constants.allTokens
  );
  let subjectModifier = new SUBJECT_MODIFIER();
  subjectModifier.parse();
  expect(subjectModifier.limit).toEqual(5);
  expect(subjectModifier.selectCards).toEqual(true);
  expect(subjectModifier.filter).toEqual("worst");
  const parsedAction = subjectModifier.action;
  expect(parsedAction).toBeInstanceOf(SHOW);
});

test("subjectModifier parse should start session branch correctly", () => {
  Tokenizer.makeTokenizer(
    "Start Session from Decks: French",
    constants.allTokens
  );
  let subjectModifier = new SUBJECT_MODIFIER();
  subjectModifier.parse();
  expect(subjectModifier.limit).toEqual(5);
  expect(subjectModifier.selectCards).toEqual(false);
  expect(subjectModifier.filter).toEqual("");
  const parsedAction = subjectModifier.action;
  expect(parsedAction).toBeInstanceOf(START_SESSION);
});
