import NODE from "./NODE";
import {
  checkNextToken,
  getAndCheckToken,
  getNextToken,
  isMoreTokens,
} from "../lib/tokenizer";

export default class DECKS extends NODE {
  decks: string[] = [];
  type = "decks";

  parseInteractivePrompt() {
    getAndCheckToken("decks:");
    while (isMoreTokens()) {
      this.decks.push(getNextToken());
      if (checkNextToken() === ",") {
        getNextToken();
      }
    }
  }
}
