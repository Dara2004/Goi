import NODE from "./NODE";
import TAG from "./TAG";
import {
  checkNextToken,
  nextTokenMatchesRegex,
  getAndCheckToken,
  getNextToken,
  isMoreTokens,
} from "../lib/tokenizer";

export default class TAGS extends NODE {
  tags: TAG[] = [];
  type = "tags";

  parseInteractivePrompt() {
    getAndCheckToken("tags:");
    while (isMoreTokens()) {
      let tag = new TAG();
      tag.parse();
      this.tags.push(tag);
      if (checkNextToken() === ",") {
        getNextToken();
      }
    }
  }

  parse() {
    const nextToken = checkNextToken().toLowerCase();
    if (nextToken === "add tags") {
      getNextToken();
    }
    getAndCheckToken(":");
    while (
      isMoreTokens() &&
      !nextTokenMatchesRegex("add color") &&
      !nextTokenMatchesRegex("add direction") &&
      !nextTokenMatchesRegex("add alignment") &&
      !nextTokenMatchesRegex("\\(")
    ) {
      if (checkNextToken() === ",") {
        getNextToken();
      }
      let tag = new TAG();
      tag.parse();
      this.tags.push(tag);
    }
  }
}
