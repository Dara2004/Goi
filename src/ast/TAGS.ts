import NODE from "./NODE";
import TAG from "./TAG";

export default class TAGS extends NODE {
  tags: TAG[] = [];

  parseInteractivePrompt() {
    this.tokenizer.getAndCheckToken("Tags:");
    while (this.tokenizer.moreTokens()) {
      let tag = new TAG();
      tag.parse();
      this.tags.push(tag);
      if (this.tokenizer.checkNext() === ",") {
        this.tokenizer.getNext();
      }
    }
  }

  parse() {
    this.tokenizer.getAndCheckToken("add Tags");
    this.tokenizer.getAndCheckToken(":");
    while (
      this.tokenizer.moreTokens() &&
      !this.tokenizer.checkToken("add Color") &&
      !this.tokenizer.checkToken("add Direction") &&
      !this.tokenizer.checkToken("add Alignment") &&
      !this.tokenizer.checkToken("\\(")
    ) {
      if (this.tokenizer.checkNext() === ",") {
        this.tokenizer.getNext();
      }
      let tag = new TAG();
      tag.parse();
      this.tags.push(tag);
    }
  }
}
