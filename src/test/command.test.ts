import Tokenizer from "../lib/tokenizer";
import HELP from "../ast/HELP";
import COMMAND from "../ast/COMMAND";
import LIST from "../ast/LIST";
import COMPLEX_COMMAND from "../ast/COMPLEX_COMMAND";
import * as constants from "../lib/constants";

test("command parse should parse help branch correctly", () => {
  Tokenizer.makeTokenizer("Help", constants.allTokens);
  let command = new COMMAND();
  command.parse();
  expect(command.command).toBeInstanceOf(HELP);
});

test("command parse should parse list branch correctly", () => {
  Tokenizer.makeTokenizer("List: Tags", constants.allTokens);
  let command = new COMMAND();
  command.parse();
  expect(command.command).toBeInstanceOf(LIST);
});

test("command parse should parse complexCommand branch correctly", () => {
  Tokenizer.makeTokenizer(
    "Show stats for minimum time spent on Tags: one tag, two tag",
    constants.allTokens
  );
  let command = new COMMAND();
  command.parse();
  expect(command.command).toBeInstanceOf(COMPLEX_COMMAND);
});
