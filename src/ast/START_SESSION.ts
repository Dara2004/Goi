import NODE from "./NODE";
import SELECTED_CARDS from "./SELECTED_CARDS";

export default class START_SESSION extends NODE {
  selectedCards: SELECTED_CARDS | null = null;

  parse() {
    this.tokenizer.getAndCheckToken("Start Session from");
    this.selectedCards = new SELECTED_CARDS();
    this.selectedCards.parse();
  }

  evaluate() {
    //stub
    throw new Error("Not implemented");
  }
}
