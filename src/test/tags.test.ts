import Tokenizer from "../lib/tokenizer";
import TAGS from "../ast/TAGS";
import * as constants from "../lib/constants";

test("tags parse should parse if syntax valid, styles parsed first", () => {
  // needs to start with a , because tokenizer will remove the first in tokenized array
  Tokenizer.makeTokenizer("add Tags: language, mid term, final", [
    "add Tags",
    ",",
    ":",
    "(1)",
  ]);
  let tags = new TAGS();
  tags.parse();
  const expectedTagArray = ["language", "mid term", "final"];
  expect(tags.tags).toHaveLength(3);
  expect(tags.tags.map((t) => t.tagName)).toEqual(expectedTagArray);
});

test("tags parseInteractivePrompt should parse if syntax valid", () => {
  Tokenizer.makeTokenizer("Tags: 1, 2, test", constants.allTokens);
  let tags = new TAGS();
  tags.parseInteractivePrompt();
  const expectedArray = ["1", "2", "test"];
  expect(tags.tags).toHaveLength(3);
  expect(tags.tags.map((t) => t.tagName)).toEqual(expectedArray);
});
