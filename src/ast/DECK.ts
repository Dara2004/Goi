import NODE from "./NODE";
import CARD from "./CARD";

export default class DECK extends NODE {
  cards: CARD[] = [];
  parse() {
    while (
      this.tokenizer.moreTokens() &&
      !this.tokenizer.checkToken("add color") &&
      !this.tokenizer.checkToken("add direction") &&
      !this.tokenizer.checkToken("add alignment") &&
      !this.tokenizer.checkToken("add tags") &&
      !this.tokenizer.checkToken("create deck")
    ) {
      let card = new CARD();
      card.parse();
      this.cards.push(card);
    }
  }
}
