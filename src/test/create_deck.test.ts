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
  Tokenizer.makeTokenizer("Create Deck with Tags", ["Create Deck", "add Tags"]);
  let cd = new CREATE_DECK();
  const parse = () => {
    cd.parse();
  };
  expect(parse).toThrow(Error);
});

test("create deck parse should throw if attribute specified but is missing (see add Color)", () => {
  Tokenizer.makeTokenizer(
    "Create Deck French:\n" +
      "add Tags: language\n" +
      "add Color: \n" +
      "add Direction: horizontal\n" +
      "(1) Front of card:Back of card\n" +
      "(2) Front:Back\n" +
      "(3) Speak:Parler\n" +
      "(4) Hello:Bonjour",
    [
      "Create Deck",
      "add Tags",
      "add Direction",
      "add Color",
      "add Alignment",
      ",",
      "\\(",
      "\\)",
      ":",
    ]
  );
  let cd = new CREATE_DECK();
  const parse = () => {
    cd.parse();
  };
  expect(parse).toThrow(Error);
});

test("create deck parse should parse if name is valid, Tag: Attribute, Cards order", () => {
  Tokenizer.makeTokenizer(
    "Create Deck French:\n" +
      "add Tags: language\n" +
      "add Color: red\n" +
      "add Direction: horizontal\n" +
      "(1) Front of card:Back of card\n" +
      "(2) Front:Back\n" +
      "(3) Speak:Parler\n" +
      "(4) Hello:Bonjour",
    [
      "Create Deck",
      "add Tags",
      "add Direction",
      "add Color",
      "add Alignment",
      ",",
      "\\(",
      "\\)",
      ":",
    ],
    true
  );
  let cd = new CREATE_DECK();
  cd.parse();
  expect(cd.name).toEqual("French");

  const expectedTagsArray = ["language"];
  expect(cd.tags.tags).toHaveLength(1);
  expect(expectedTagsArray).toEqual(["language"]);

  const attributeArray = cd.attributes.attributes.map((a) => a.attribute);
  expect(cd.attributes.attributes).toHaveLength(2);
  expect(attributeArray).toEqual([
    { attributeType: "color", value: "red" },
    { attributeType: "direction", value: "horizontal" },
  ]);
});

test("create deck parse should parse if name is valid: Attribute, Tags, Cards order", () => {
  Tokenizer.makeTokenizer(
    "Create Deck French:\n" +
      "add Color: red\n" +
      "add Direction: horizontal\n" +
      "add Tags: language, final\n" +
      "(1) Front of card:Back of card\n" +
      "(2) Front:Back\n" +
      "(3) Speak:Parler\n" +
      "(4) Hello:Bonjour",
    [
      "Create Deck",
      "add Tags",
      "add Direction",
      "add Color",
      "add Alignment",
      ",",
      "\\(",
      "\\)",
      ":",
    ],
    true
  );
  let cd = new CREATE_DECK();
  cd.parse();
  expect(cd.name).toEqual("French");

  const tagsArray = cd.tags.tags.map((t) => t.tagName);
  const expectedTagsArray = ["language", "final"];
  expect(cd.tags.tags).toHaveLength(2);
  expect(tagsArray).toEqual(expectedTagsArray);

  const attributeArray = cd.attributes.attributes.map((a) => a.attribute);
  expect(cd.attributes.attributes).toHaveLength(2);
  expect(attributeArray).toEqual([
    { attributeType: "color", value: "red" },
    { attributeType: "direction", value: "horizontal" },
  ]);

  const cardFrontArray = cd.deck.cards.map((c) => c.front);
  expect(cd.deck.cards).toHaveLength(4);
  expect(cardFrontArray).toEqual(["Front of card", "Front", "Speak", "Hello"]);
});

test("create deck parse should parse if name is valid: Attribute, Cards, Tags order", () => {
  Tokenizer.makeTokenizer(
    "Create Deck French:\n" +
      "add Color: red\n" +
      "add Direction: horizontal\n" +
      "add Alignment: center\n" +
      "(1) Front of card:Back of card\n" +
      "(2) Front:Back\n" +
      "(3) Speak:Parler\n" +
      "(4) Hello:Bonjour\n" +
      "add Tags: language, final",
    [
      "Create Deck",
      "add Tags",
      "add Direction",
      "add Color",
      "add Alignment",
      ",",
      "\\(",
      "\\)",
      ":",
    ],
    true
  );
  let cd = new CREATE_DECK();
  cd.parse();
  expect(cd.name).toEqual("French");

  const tagsArray = cd.tags.tags.map((t) => t.tagName);
  const expectedTagsArray = ["language", "final"];
  expect(cd.tags.tags).toHaveLength(2);
  expect(tagsArray).toEqual(expectedTagsArray);

  const attributeArray = cd.attributes.attributes.map((a) => a.attribute);
  expect(cd.attributes.attributes).toHaveLength(3);
  expect(attributeArray).toEqual([
    { attributeType: "color", value: "red" },
    { attributeType: "direction", value: "horizontal" },
    { attributeType: "alignment", value: "center" },
  ]);

  const cardFrontArray = cd.deck.cards.map((c) => c.front);
  expect(cd.deck.cards).toHaveLength(4);
  expect(cardFrontArray).toEqual(["Front of card", "Front", "Speak", "Hello"]);
});
test("create deck parse should parse if name is valid: Cards, Attributes, Tags order", () => {
  Tokenizer.makeTokenizer(
    "Create Deck French:\n" +
      "(1) Front of card:Back of card\n" +
      "(2) Front:Back\n" +
      "(3) Speak:Parler\n" +
      "(4) Hello:Bonjour\n" +
      "add Color: red\n" +
      "add Direction: horizontal\n" +
      "add Alignment: center\n" +
      "add Tags: language, final",
    [
      "Create Deck",
      "add Tags",
      "add Direction",
      "add Color",
      "add Alignment",
      ",",
      "\\(",
      "\\)",
      ":",
    ],
    true
  );
  let cd = new CREATE_DECK();
  cd.parse();

  expect(cd.name).toEqual("French");

  const tagsArray = cd.tags.tags.map((t) => t.tagName);
  const expectedTagsArray = ["language", "final"];
  expect(cd.tags.tags).toHaveLength(2);
  expect(tagsArray).toEqual(expectedTagsArray);

  const attributeArray = cd.attributes.attributes.map((a) => a.attribute);
  expect(cd.attributes.attributes).toHaveLength(3);
  expect(attributeArray).toEqual([
    { attributeType: "color", value: "red" },
    { attributeType: "direction", value: "horizontal" },
    { attributeType: "alignment", value: "center" },
  ]);

  const cardFrontArray = cd.deck.cards.map((c) => c.front);
  expect(cd.deck.cards).toHaveLength(4);
  expect(cardFrontArray).toEqual(["Front of card", "Front", "Speak", "Hello"]);
});

test("create deck parse should parse if name is valid: No Attributes or Tags", () => {
  Tokenizer.makeTokenizer(
    "Create Deck French:\n" +
      "(1) Front of card:Back of card\n" +
      "(2) Front:Back\n" +
      "(3) Speak:Parler\n" +
      "(4) Hello:Bonjour",
    [
      "Create Deck",
      "add Tags",
      "add Direction",
      "add Color",
      "add Alignment",
      ",",
      "\\(",
      "\\)",
      ":",
    ],
    true
  );
  let cd = new CREATE_DECK();
  cd.parse();
  expect(cd.name).toEqual("French");
  expect(cd.tags).toEqual(null);
  expect(cd.attributes).toEqual(null);

  const cardFrontArray = cd.deck.cards.map((c) => c.front);
  expect(cd.deck.cards).toHaveLength(4);
  expect(cardFrontArray).toEqual(["Front of card", "Front", "Speak", "Hello"]);
});
