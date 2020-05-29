import NODE from "./NODE";
import CREATE_DECK from "./CREATE_DECK";
import { nextTokenMatchesRegex, isMoreTokens } from "../lib/tokenizer";

export default class PROGRAM extends NODE {
  create_decks: CREATE_DECK[] = [];
  parse() {
    while (isMoreTokens()) {
      if (nextTokenMatchesRegex("create deck")) {
        let create_deck = new CREATE_DECK();
        create_deck.parse();
        this.create_decks.push(create_deck);
      } else {
        break;
      }
    }
  }
}
