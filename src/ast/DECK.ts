import NODE from "./NODE";
import CARD from "./CARD";
import { checkToken, moreTokens } from "../lib/tokenizer";

export default class DECK extends NODE {
  cards: CARD[] = [];
  parse() {
    while (
      moreTokens() &&
      !checkToken("add color") &&
      !checkToken("add direction") &&
      !checkToken("add alignment") &&
      !checkToken("add tags") &&
      !checkToken("create deck")
    ) {
      let card = new CARD();
      card.parse();
      this.cards.push(card);
    }
  }
}
