import NODE from "./NODE";
import SELECTED_CARDS from "./SELECTED_CARDS";
import * as constants from "../lib/constants";

export default class START_SESSION extends NODE {
  selectedCards: SELECTED_CARDS | null = null;
  limit: number = NaN;

  parse() {
    this.tokenizer.getAndCheckToken("Start Session from");
    const nextToken = this.tokenizer.checkNext();
    if (!isNaN(Number(nextToken))) {
      this.limit = Math.round(Number(this.tokenizer.getNext()));
    }
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
