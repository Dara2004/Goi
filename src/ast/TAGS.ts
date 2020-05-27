import NODE from "./NODE";
import TAG from "./TAG";

export default class TAGS extends NODE {
  tags: TAG[] = [];
  type = "tags";

  parseInteractivePrompt() {
    this.tokenizer.getAndCheckToken("tags:");
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
    const nextToken = this.tokenizer.checkNext().toLowerCase();
    if (nextToken === "add tags") {
      this.tokenizer.getNext();
    }
    this.tokenizer.getAndCheckToken(":");
    while (
      this.tokenizer.moreTokens() &&
      !this.tokenizer.checkToken("add color") &&
      !this.tokenizer.checkToken("add direction") &&
      !this.tokenizer.checkToken("add alignment") &&
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
