import { debug } from "./utils";

export function setTokens(tokens: string[]) {
  const stringifiedTokens = JSON.stringify(tokens);
  localStorage.setItem("tokens", stringifiedTokens);
}

export function getTokens(): string[] {
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
  setTokens(tokens);
  debug(tokens);
}

export function checkNext(): string {
  const tokens = getTokens();
  return tokens.length > 0 ? tokens[0] : "no more tokens to check";
}

export function getNext(): string {
  const tokens = getTokens();
  let retToken = tokens.length > 0 ? tokens[0] : "no more tokens to get";
  tokens.shift();
  setTokens(tokens);
  return retToken;
}

export function checkToken(regexp: string): boolean {
  const nextToken = checkNext();
  const re = new RegExp(regexp);
  debug(
    `Check token is now comparing: the token |${nextToken}|  to  the regexp |${regexp}|`
  );
  return !!nextToken.match(re);
}

export function getAndCheckToken(regexp: string): string {
  const token = getNext();
  const re = new RegExp(regexp);

  if (!token.match(re)) {
    throw Error(`Expected the regexp ${regexp} but got the token ${token}`);
  }
  debug(`matched the token ${token}  to  the regexp ${regexp}`);
  return token;
}

export function moreTokens(): boolean {
  const tokens = getTokens();
  return tokens.length > 0;
}
