import CREATE_DECK from "../ast/CREATE_DECK";
import Tokenizer from "../lib/tokenizer";

test("create deck parse should throw if the input doesnt start with Create Deck", () => {
  let cd = new CREATE_DECK();
  Tokenizer.theTokenizer = undefined;
  Tokenizer.makeTokenizer("Test Create Deck", ["Create Deck"]);
  const parse = () => {
    cd.parse();
  };
  expect(parse).toThrow(Error);
});

test("create deck parse should throw if name is missing", () => {
  let cd = new CREATE_DECK();
  Tokenizer.theTokenizer = undefined;
  Tokenizer.makeTokenizer("Create Deck with Tags", [
    "Create Deck",
    "with Tags",
  ]);
  const parse = () => {
    cd.parse();
  };
  expect(parse).toThrow(Error);
});

test("create deck parse should parse if name is valid", () => {
  let cd = new CREATE_DECK();
  Tokenizer.theTokenizer = undefined;
  Tokenizer.makeTokenizer("Create Deck French with Tags language", [
    "Create Deck",
    "with Tags",
  ]);
  cd.parse();
  expect(cd.name).toEqual("French");
  expect(cd.tags).toEqual(["language"]);
});
