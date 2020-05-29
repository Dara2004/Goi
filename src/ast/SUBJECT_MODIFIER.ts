import NODE from "./NODE";
import * as constants from "../lib/constants";
import { checkNext, getNext } from "../lib/tokenizer";

export default class SUBJECT_MODIFIER extends NODE {
  type: string = "";
  filter: string = "newest";
  limit: number = 100;
  selectCards: boolean = false;

  parse() {
    const actionToken = getNext();
    if (actionToken === "show stats for") {
      this.type = "show stats";
    } else if (actionToken === "start session from") {
      this.type = "start session";
    } else {
      throw new Error(
        "Command must either start with 'Show stats for' or 'Start Session from'"
      );
    }
    let nextToken = checkNext();
    if (!isNaN(Number(nextToken))) {
      this.limit = Math.round(Number(getNext()));
      nextToken = checkNext();
    }
    if (constants.validCardFilter.includes(nextToken)) {
      this.filter = getNext();
      nextToken = checkNext();
    }
    if (nextToken === "cards from") {
      this.selectCards = true;
      getNext();
    }
  }
}
