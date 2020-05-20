import NODE from "./NODE";
import CARD from "./CARD";

export default class DECK extends NODE {
  cards: CARD[] = [];
  parse() {
    this.tokenizer.getAndCheckToken(":");
    while (
      this.tokenizer.moreTokens() &&
      !this.tokenizer.checkToken("Creat Style")
    ) {
      let card = new CARD();
      card.parse();
      this.cards.push(card);
    }
  }

  evaluate() {
    // stub
    throw new Error("Not implemented");
  }
}
