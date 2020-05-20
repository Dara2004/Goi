import NODE from "./NODE";
import SELECTED_CARDS from "./SELECTED_CARDS";
import * as constants from "../lib/constants";

export default class START_SESSION extends NODE {
  selectedCards: SELECTED_CARDS | null = null;

  parse() {
    this.tokenizer.getAndCheckToken("Start Session from");
    if (constants.validCardFilter.includes(this.tokenizer.checkNext())) {
      this.selectedCards = new SELECTED_CARDS();
      this.selectedCards.parse();
    }
  }

  evaluate() {
    //stub
    throw new Error("Not implemented");
  }
}
