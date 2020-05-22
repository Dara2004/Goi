import NODE from "./NODE";
import CREATE_DECK from "./CREATE_DECK";

export default class PROGRAM extends NODE {
  create_decks: CREATE_DECK[] = [];
  parse() {
    while (this.tokenizer.moreTokens()) {
      if (this.tokenizer.checkToken("Create Deck")) {
        let create_deck = new CREATE_DECK();
        create_deck.parse();
        this.create_decks.push(create_deck);
      } else {
        break;
      }
    }
  }
}
