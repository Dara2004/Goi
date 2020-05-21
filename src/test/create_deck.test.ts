import CREATE_DECK from "../ast/CREATE_DECK";
import Tokenizer from "../lib/tokenizer";

test("create deck parse should throw if the input doesnt start with Create Deck", () => {
  Tokenizer.makeTokenizer("Test Create Deck", ["Create Deck"]);
  let cd = new CREATE_DECK();
  const parse = () => {
    cd.parse();
  };
  expect(parse).toThrow(Error);
});

test("create deck parse should throw if name is missing", () => {
  Tokenizer.makeTokenizer("Create Deck with Tags", [
    "Create Deck",
    "with Tags",
  ]);
  let cd = new CREATE_DECK();
  const parse = () => {
    cd.parse();
  };
  expect(parse).toThrow(Error);
});

test("create deck parse should parse if name is valid", () => {
  Tokenizer.makeTokenizer(
    "Create Deck French with Tags language:\n" +
      "(1) Front of card:Back of card\n" +
      "(2) Front:Back\n" +
      "(3) Speak:Parler\n" +
      "(4) Hello:Bonjour",
    ["Create Deck", "with Tags", "\\(", "\\)", ":"],
    true
  );
  let cd = new CREATE_DECK();
  cd.parse();
  expect(cd.name).toEqual("French");
  if (cd.tags) {
    expect(cd.tags.tags).toHaveLength(1);
  }
});
