import NODE from "./NODE";
import CARD from "./CARD";
import { nextTokenMatchesRegex, isMoreTokens } from "../lib/tokenizer";

export default class DECK extends NODE {
  cards: CARD[] = [];
  parse() {
    while (
      isMoreTokens() &&
      !nextTokenMatchesRegex("add color") &&
      !nextTokenMatchesRegex("add direction") &&
      !nextTokenMatchesRegex("add alignment") &&
      !nextTokenMatchesRegex("add tags") &&
      !nextTokenMatchesRegex("create deck")
    ) {
      let card = new CARD();
      card.parse();
      this.cards.push(card);
    }
  }
}
