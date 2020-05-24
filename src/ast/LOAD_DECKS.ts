import NODE from "./NODE";

export default class LOAD_DECKS extends NODE {
  isLoadDecks: boolean;

  parse() {
    this.tokenizer.getAndCheckToken("Load decks");
    this.isLoadDecks = true;
  }
}
