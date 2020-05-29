import NODE from "./NODE";
import TAG from "./TAG";
import {
  checkNext,
  checkToken,
  getAndCheckToken,
  getNext,
  moreTokens,
} from "../lib/tokenizer";

export default class TAGS extends NODE {
  tags: TAG[] = [];
  type = "tags";

  parseInteractivePrompt() {
    getAndCheckToken("tags:");
    while (moreTokens()) {
      let tag = new TAG();
      tag.parse();
      this.tags.push(tag);
      if (checkNext() === ",") {
        getNext();
      }
    }
  }

  parse() {
    const nextToken = checkNext().toLowerCase();
    if (nextToken === "add tags") {
      getNext();
    }
    getAndCheckToken(":");
    while (
      moreTokens() &&
      !checkToken("add color") &&
      !checkToken("add direction") &&
      !checkToken("add alignment") &&
      !checkToken("\\(")
    ) {
      if (checkNext() === ",") {
        getNext();
      }
      let tag = new TAG();
      tag.parse();
      this.tags.push(tag);
    }
  }
}
