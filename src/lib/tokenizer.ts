import { debug } from "./utils";

// file based on functions and steps for tokenization shown in class
export function setTokensInLocalStorage(tokens: string[]) {
  const stringifiedTokens = JSON.stringify(tokens);
  localStorage.setItem("tokens", stringifiedTokens);
}

export function getTokensFromLocalStorage(): string[] {
  const stringifiedTokens = localStorage.getItem("tokens");
  return JSON.parse(stringifiedTokens);
}

export function tokenize(program: string, literals: string[]): void {
  let tokenizedProgram = program;
  tokenizedProgram = tokenizedProgram.replace(/\n/g, "RESERVEDWORD");
  debug(program);

  literals.forEach((s) => {
    debug("string: ", s);
    const re = new RegExp(s, "ig");
    debug("regexp: ", re);
    tokenizedProgram = tokenizedProgram.replace(
      re,
      `RESERVEDWORD${s}RESERVEDWORD`
    );
    debug(tokenizedProgram);
  });
  tokenizedProgram = tokenizedProgram.replace(
    /RESERVEDWORDRESERVEDWORD/g,
    "RESERVEDWORD"
  );
  debug(tokenizedProgram);
  const temparray = tokenizedProgram.split("RESERVEDWORD");
  const slicedArray = temparray.slice(1);
  const tokens = slicedArray.map((t) => t.trim()).filter((t) => t !== "");
  setTokensInLocalStorage(tokens);
  debug(tokens);
}

export function checkNextToken(): string {
  const tokens = getTokensFromLocalStorage();
  return tokens.length > 0 ? tokens[0] : "no more tokens to check";
}

export function getNextToken(): string {
  const tokens = getTokensFromLocalStorage();
  let retToken = tokens.length > 0 ? tokens[0] : "no more tokens to get";
  tokens.shift();
  setTokensInLocalStorage(tokens);
  return retToken;
}

export function nextTokenMatchesRegex(regexp: string): boolean {
  const nextToken = checkNextToken();
  const re = new RegExp(regexp);
  debug(
    `Check token is now comparing: the token |${nextToken}|  to  the regexp |${regexp}|`
  );
  return !!nextToken.match(re);
}

export function getAndCheckToken(regexp: string): string {
  const nextToken = getNextToken();
  const re = new RegExp(regexp);

  if (!nextToken.match(re)) {
    throw Error(`Expected the regexp ${regexp} but got the token ${nextToken}`);
  }
  debug(`matched the token ${nextToken}  to  the regexp ${regexp}`);
  return nextToken;
}

export function isMoreTokens(): boolean {
  const tokens = getTokensFromLocalStorage();
  return tokens.length > 0;
}
