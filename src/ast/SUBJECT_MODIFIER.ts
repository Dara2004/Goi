import NODE from "./NODE";
import * as constants from "../lib/constants";

export default class SUBJECT_MODIFIER extends NODE {
  type: string = "";
  filter: string = "newest";
  limit: number = 100;
  selectCards: boolean = false;

  parse() {
    const actionToken = this.tokenizer.getNext();
    if (actionToken === "show stats for") {
      this.type = "show stats";
    } else if (actionToken === "start session from") {
      this.type = "start session";
    } else {
      throw new Error(
        "Command must either start with 'Show stats for' or 'Start Session from'"
      );
    }
    let nextToken = this.tokenizer.checkNext();
    if (!isNaN(Number(nextToken))) {
      this.limit = Math.round(Number(this.tokenizer.getNext()));
      nextToken = this.tokenizer.checkNext();
    }
    if (constants.validCardFilter.includes(nextToken)) {
      this.filter = this.tokenizer.getNext();
      nextToken = this.tokenizer.checkNext();
    }
    if (nextToken === "cards from") {
      this.selectCards = true;
      this.tokenizer.getNext();
    }
  }
}
