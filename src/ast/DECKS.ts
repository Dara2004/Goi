import NODE from "./NODE";

export default class DECKS extends NODE {
  decks: string[] = [];

  parse() {
    this.tokenizer.getAndCheckToken("Decks:");
    while (this.tokenizer.moreTokens()) {
      this.decks.push(this.tokenizer.getNext());
      if (this.tokenizer.checkNext() === ",") {
        this.tokenizer.getNext();
      }
    }
  }
}
