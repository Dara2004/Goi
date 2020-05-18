import Tokenizer from "../lib/tokenizer";

const END_OF_TOKENS_LIST = "NULLTOKEN";
const ERROR_TYPE = Error;

beforeEach(() => {
  Tokenizer.theTokenizer = undefined;
});

// helper
function getTokens(program: string, literals: string[]): string[] {
  Tokenizer.makeTokenizer(program, literals);
  return Tokenizer.getTokenizer().tokens;
}

test("Tokenizer creates empty array for empty string", () => {
  expect(getTokens("", [])).toEqual([]);
});

test("Tokenizer does not create non-constant-literal split by newline", () => {
  const actualTokens = getTokens("TE\nST", []);

  // Add "" to end of expectedTokens if it's expected behavior
  const expectedTokens = ["TE", "ST"];

  expect(actualTokens).toEqual(expectedTokens);
});

test("Tokenizer does not create constant-literal split by newline", () => {
  const actualTokens = getTokens("TE\nST", ["TEST"]);

  // Add "" to end of expectedTokens if it's expected behavior
  const expectedTokens = ["TE", "ST"];

  expect(actualTokens).toEqual(expectedTokens);
});

// Remove if not required
test("Tokenizer creates trimmed tokens", () => {
  const program = "Literal1 Str1 Literal2 Str2";
  const literals = ["Literal1", "Literal2"];
  const actualTokens = getTokens(program, literals);

  // Add "" to end of expectedTokens if it's expected behavior
  const expectedTokens = ["Literal1", "Str1", "Literal2", "Str2"];

  expect(actualTokens).toEqual(expectedTokens);
});

test("Tokenizer correctly tokenizes if a literal appears twice", () => {
  const program = "Literal Str1 Literal Str2";
  const literals = ["Literal"];
  const actualTokens = getTokens(program, literals);

  // Add "" to end of expectedTokens if it's expected behavior
  const expectedTokens = ["Literal", "Str1", "Literal", "Str2"];

  expect(actualTokens).toEqual(expectedTokens);
});

test("Tokenizer does not remove whitespace inside of variable string", () => {
  const program = "Literal Str1A Str1B Literal Str2";
  const literals = ["Literal"];
  const actualTokens = getTokens(program, literals);
  console.log("actual tokens: ", actualTokens);

  // Add "" to end of expectedTokens if it's expected behavior
  const expectedTokens = ["Literal", "Str1A Str1B", "Literal", "Str2"];

  expect(actualTokens).toEqual(expectedTokens);
});

// helper
function makeTokenizer(program: string, literals: string[]): Tokenizer {
  Tokenizer.makeTokenizer(program, literals);
  return Tokenizer.getTokenizer();
}

test("Tokenizer::getNext returns the next token", () => {
  const program = "Literal1 Str1A Str1B Literal2 Str2 Literal1 Str3";
  const literals = ["Literal1", "Literal2"];
  const tokenizer = makeTokenizer(program, literals);

  // Set tokens to expected tokens
  const expectedTokens = [
    "Literal1",
    "Str1A Str1B",
    "Literal2",
    "Str2",
    "Literal1",
    "Str3",
  ];
  tokenizer.tokens = expectedTokens;

  expectedTokens.forEach((token) => {
    const gotNext = tokenizer.getNext();
    expect(gotNext).toBe(token);
  });
  expect(tokenizer.getNext()).toBe(END_OF_TOKENS_LIST);
});

test("Tokenizer::moreTokens", () => {
  const program = "Literal1 Str1A Str1B Literal2 Str2 Literal1 Str3";
  const literals = ["Literal1", "Literal2"];
  const tokenizer = makeTokenizer(program, literals);

  // Set tokens to expected tokens
  const expectedTokens = [
    "Literal1",
    "Str1A Str1B",
    "Literal2",
    "Str2",
    "Literal1",
    "Str3",
  ];
  tokenizer.tokens = expectedTokens;

  expectedTokens.forEach((_, idx) => {
    _ = tokenizer.getNext();
    if (idx < expectedTokens.length - 1) {
      expect(tokenizer.moreTokens()).toBe(true);
    } else {
      expect(tokenizer.moreTokens()).toBe(false);
    }
  });
});

test("Tokenizer::checkToken", () => {
  const program = "Literal1 Str1A Str1B Literal2 Str2 Literal1 Str3";
  const literals = ["Literal1", "Literal2"];
  const tokenizer = makeTokenizer(program, literals);

  // Set tokens to expected tokens
  const expectedTokens = [
    "Literal1",
    "Str1A Str1B",
    "Literal2",
    "Str2",
    "Literal1",
    "Str3",
  ];
  tokenizer.tokens = expectedTokens;

  expectedTokens.forEach((token) => {
    expect(tokenizer.checkToken(token)).toBeTruthy();
    expect(tokenizer.checkToken(" ")).toBeFalsy();
    expect(tokenizer.checkToken("non-match")).toBeFalsy();
    const _ = tokenizer.getNext();
  });
});

test("Tokenizer::getAndCheckNext throws when does not match", () => {
  const program = "Literal1 Str1A Str1B Literal2 Str2 Literal1 Str3";
  const literals = ["Literal1", "Literal2"];
  const tokenizer = makeTokenizer(program, literals);

  // Set tokens to expected tokens
  const expectedTokens = [
    "Literal1",
    "Str1A Str1B",
    "Literal2",
    "Str2",
    "Literal1",
    "Str3",
  ];
  tokenizer.tokens = expectedTokens;

  expect(() => {
    tokenizer.getAndCheckToken("non-match");
  }).toThrow(ERROR_TYPE);
});

test("Tokenizer::getAndCheckNext returns correct string when matches", () => {
  const program = "Literal1 Str1A Str1B Literal2 Str2 Literal1 Str3";
  const literals = ["Literal1", "Literal2"];
  const tokenizer = makeTokenizer(program, literals);

  // Set tokens to expected tokens
  const expectedTokens = [
    "Literal1",
    "Str1A Str1B",
    "Literal2",
    "Str2",
    "Literal1",
    "Str3",
  ];
  tokenizer.tokens = expectedTokens;

  expectedTokens.forEach((token) => {
    const actualToken = tokenizer.getAndCheckToken(token);
    expect(actualToken).toBe(token);
  });
});
