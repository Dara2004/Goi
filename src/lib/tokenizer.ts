import { debug } from "./utils";

class Tokenizer {
  private static program: string;
  private static literals: Array<string>;
  private tokens: Array<string>;
  private currentToken: number;
  private static theTokenizer: Tokenizer;

  private constructor(content: string, literalsList: Array<string>) {
    Tokenizer.program = content;
    Tokenizer.literals = literalsList;
    this.tokens = [];
    this.currentToken = 0;

    this.tokenize();
  }

  tokenize(): void {
    let tokenizedProgram = Tokenizer.program;
    tokenizedProgram = tokenizedProgram.replace(/\n/g, "_");
    tokenizedProgram = tokenizedProgram.toLowerCase();
    debug(Tokenizer.program);

    Tokenizer.literals.forEach((s) => {
      debug("string: ", s);
      const re = new RegExp(s, "g");
      debug("regexp: ", re);
      tokenizedProgram = tokenizedProgram.replace(re, `_${s}_`);
      debug(tokenizedProgram);
    });
    tokenizedProgram = tokenizedProgram.replace(/__/g, "_");
    debug(tokenizedProgram);
    const temparray = tokenizedProgram.split("_");
    const slicedArray = temparray.slice(1);
    this.tokens = slicedArray.map((t) => t.trim()).filter((t) => t !== "");
    debug(this.tokens);
  }

  checkNext(): string {
    let token = "";

    if (this.currentToken < this.tokens.length) {
      token = this.tokens[this.currentToken];
    } else {
      token = "NO_MORE_TOKENS";
    }

    return token;
  }

  getNext(): string {
    let token = "";

    if (this.currentToken < this.tokens.length) {
      token = this.tokens[this.currentToken];
      this.currentToken++;
    } else {
      token = "NULLTOKEN";
    }

    return token;
  }

  checkToken(regexp: string): boolean {
    const s = this.checkNext();
    const re = new RegExp(regexp);
    debug(`comparing: |${s}|  to  |${regexp}|`);
    return !!s.match(re);
  }

  getAndCheckToken(regexp: string): string {
    const s = this.getNext();
    const re = new RegExp(regexp);

    if (!s.match(re)) {
      throw Error(
        `Unexpected next token for Parsing! Expected something matching: ${regexp} but got: ${s}`
      );
    }
    debug(`matched: ${s}  to  ${regexp}`);
    return s;
  }

  moreTokens(): boolean {
    return this.currentToken < this.tokens.length;
  }

  static makeTokenizer(content: string, literals: Array<string>): void {
    this.theTokenizer = new Tokenizer(content, literals);
  }

  static getTokenizer(): Tokenizer {
    return this.theTokenizer;
  }
}

export default Tokenizer;
