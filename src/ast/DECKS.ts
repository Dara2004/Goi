import NODE from "./NODE";

export default class DECKS extends NODE {
  decks: string[] = [];
  type = "decks";

  parseInteractivePrompt() {
    this.tokenizer.getAndCheckToken("decks:");
    while (this.tokenizer.moreTokens()) {
      this.decks.push(this.tokenizer.getNext());
      if (this.tokenizer.checkNext() === ",") {
        this.tokenizer.getNext();
      }
    }
  }
}
