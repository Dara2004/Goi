import NODE from "./NODE";
import TAG from "./TAG";

export default class TAGS extends NODE {
  tags: TAG[] = [];

  parse() {
    this.tokenizer.getAndCheckToken("add Tags");
    this.tokenizer.getAndCheckToken(":");
    while (
      this.tokenizer.moreTokens() &&
      this.tokenizer.checkNext() !== "add Color" &&
      this.tokenizer.checkNext() !== "add Direction" &&
      this.tokenizer.checkNext() !== "add Alignment" &&
      this.tokenizer.checkNext() !== "\\("
    ) {
      let tag = new TAG();
      tag.parse();
      this.tags.push(tag);
    }
  }

  evaluate() {
    // stub
    throw new Error("Not implemented");
  }
}
