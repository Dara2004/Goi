import NODE from "./NODE";
import {
  checkNext,
  getAndCheckToken,
  getNext,
  moreTokens,
} from "../lib/tokenizer";

export default class DECKS extends NODE {
  decks: string[] = [];
  type = "decks";

  parseInteractivePrompt() {
    getAndCheckToken("decks:");
    while (moreTokens()) {
      this.decks.push(getNext());
      if (checkNext() === ",") {
        getNext();
      }
    }
  }
}
