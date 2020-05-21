import NODE from "./NODE";
import CARD from "./CARD";

export default class DECK extends NODE {
  cards: CARD[] = [];
  parse() {
    while (
      this.tokenizer.moreTokens() &&
      !this.tokenizer.checkToken("add Color") &&
      !this.tokenizer.checkToken("add Direction") &&
      !this.tokenizer.checkToken("add Alignment") &&
      !this.tokenizer.checkToken("add Tags")
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
