import NODE from "./NODE";
import TAG from "./TAG";

export default class TAGS extends NODE {
  tags: TAG[] = [];

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
      let tag = new TAG();
      tag.parse();
      this.tags.push(tag);
    }
  }
}
