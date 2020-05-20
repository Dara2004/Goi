import Tokenizer from "../lib/tokenizer";
import TAGS from "../ast/TAGS";

test("tags parse should parse if syntax valid, styles parsed first", () => {
  // needs to start with a , because tokenizer will remove the first in tokenized array
  Tokenizer.makeTokenizer("with Tags language, mid term, final:", [
    "with Tags",
    ",",
    ":",
    "using Style",
  ], true);
  let tags = new TAGS();
  tags.parse();
  const expectedTagArray = ["language", "mid term", "final"];
  expect(tags.tags).toHaveLength(3);
  expect(tags.tags.map((t) => t.tagName)).toEqual(expectedTagArray);
});

test("tags parse should parse if syntax valid, styles parsed after", () => {
  Tokenizer.makeTokenizer("with Tags language, mid term, final using Style", [
    "with Tags",
    ",",
    ":",
    "using Style",
  ], true);
  let tags = new TAGS();
  tags.parse();
  const expectedTagArray = ["language", "mid term", "final"];
  expect(tags.tags).toHaveLength(3);
  expect(tags.tags.map((t) => t.tagName)).toEqual(expectedTagArray);
});
