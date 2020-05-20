import NODE from "./NODE";
import * as constants from "../lib/constants";

export default class SELECTED_CARDS extends NODE {
  cardFilter: string = "";

  parse() {
    this.cardFilter = this.tokenizer.getNext();

    if (!constants.validCardFilter.includes(this.cardFilter)) {
      throw new Error("Invalid Card Filter");
    }
    this.tokenizer.getAndCheckToken("cards from");
  }
}
