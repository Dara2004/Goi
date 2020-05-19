class Tokenizer {
  static theTokenizer;

  constructor(content, literalsList) {
    this.program = content;
    this.literals = literalsList;
    this.tokens = [];
    this.currentToken = 0;

    this.tokenize();
  }

  tokenize() {
    let tokenizedProgram = this.program;
    tokenizedProgram = tokenizedProgram.replace(/\n/g, '');
    console.log(this.program);

    this.literals.forEach(
        s => {
          const re = new RegExp(s, 'g');
          tokenizedProgram = tokenizedProgram.replace(re, `_${s}_`);
          console.log(tokenizedProgram);
        });
    tokenizedProgram = tokenizedProgram.replace(/__/g, '_');
    console.log(tokenizedProgram);
    const temparray = tokenizedProgram.split('_');
    this.tokens = temparray.slice(1);
    console.log(this.tokens);
  }

  checkNext() {
    let token = '';

    if (this.currentToken < this.tokens.length) {
      token = this.tokens[this.currentToken];
    } else {
      token = 'NO_MORE_TOKENS';
    }

    return token;
  }

  getNext() {
    let token = '';

    if (this.currentToken < this.tokens.length) {
      token = this.tokens[this.currentToken];
      this.currentToken++;
    } else {
      token = 'NULLTOKEN';
    }

    return token;
  }

  checkToken(regexp) {
    const s = this.checkNext();
    console.log(`comparing: |${s}|  to  |${regexp}|`);
    return !!s.match(regexp);
  }

  getAndCheckToken(regexp) {
    const s = this.getNext();

    if (!s.match(regexp)) {
      throw Error(
          `Unexpected next token for Parsing! Expected something matching: ${regexp} but got: ${s}`);
    }
    console.log(`matched: ${s}  to  ${regexp}`);

    return s;
  }

  moreTokens() {
    return this.currentToken < this.tokens.length;
  }

  static makeTokenizer(content, literals) {
    if (!this.theTokenizer) {
      this.theTokenizer = new Tokenizer(content, literals);
    }
  }

  static getTokenizer() {
    return this.theTokenizer;
  }
}

export default Tokenizer;
