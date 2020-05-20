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
    console.log(Tokenizer.program);

    Tokenizer.literals.forEach((s) => {
      const re = new RegExp(s, "g");
      tokenizedProgram = tokenizedProgram.replace(re, `_${s}_`);
      console.log(tokenizedProgram);
    });
    tokenizedProgram = tokenizedProgram.replace(/__/g, "_");
    console.log(tokenizedProgram);
    const temparray = tokenizedProgram.split("_");
    const slicedArray = temparray.slice(1);
    this.tokens = slicedArray
      .map((t) => t.trim())
      .filter((t) => t !== "," && t !== "");
    console.log(this.tokens);
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
    console.log(`comparing: |${s}|  to  |${regexp}|`);
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
    console.log(`matched: ${s}  to  ${regexp}`);

    return s;
  }

  moreTokens(): boolean {
    return this.currentToken < this.tokens.length;
  }

  static makeTokenizer(content: string, literals: Array<string>, makeNewTokenizer?: boolean): void {
    if (!this.theTokenizer || makeNewTokenizer) {
      this.theTokenizer = new Tokenizer(content, literals);
    }
  }

  static getTokenizer(): Tokenizer {
    return this.theTokenizer;
  }
}

export default Tokenizer;
