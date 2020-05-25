import NODE from "./NODE";

export default class LOAD_DECKS extends NODE {
  parse() {
    this.tokenizer.getAndCheckToken("load decks");
  }
}
