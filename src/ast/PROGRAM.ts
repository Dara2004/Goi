import NODE from "./NODE";
import CREATE_DECK from "./CREATE_DECK";
import CREATE_STYLE from "./CREATE_STYLE";

class PROGRAM extends NODE {
  create_decks: CREATE_DECK[] = [];
  create_styles: CREATE_STYLE[] = [];
  parse() {
    while (this.tokenizer.moreTokens()) {
      if (this.tokenizer.checkToken(new RegExp("Create Deck"))) {
        let create_deck = new CREATE_DECK();
        create_deck.parse();
        this.create_decks.push(create_deck);
      }
      if (this.tokenizer.checkToken(new RegExp("Create Style"))) {
        let create_style = new CREATE_STYLE();
        create_style.parse();
        this.create_styles.push(create_style);
      }
    }
  }

  evaluate() {
    // stub
    throw new Error("Not implemented");
  }
}
