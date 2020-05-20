import NODE from "./NODE";
import TAG from "./TAG";

export default class TAGS extends NODE {
  tags: TAG[] = [];

  parse() {
    this.tokenizer.getAndCheckToken("with Tags");
    while (
      this.tokenizer.moreTokens() &&
      this.tokenizer.checkNext() !== "using Style" &&
      this.tokenizer.checkNext() !== ":"
    ) {
      let tag = new TAG();
      tag.parse();
      this.tags.push(tag);
    }
  }

    evaluate() {
        // stub
        throw new Error('Not implemented');
    }
}
