import NODE from "./NODE";
import SHOW from "./SHOW";
import START_SESSION from "./START_SESSION";
import * as constants from "../lib/constants";

export default class SUBJECT_MODIFIER extends NODE {
  type: string = "";
  // action: SHOW | START_SESSION | null = null;
  filter: string = "";
  limit: number = 5;
  selectCards: boolean = false;

  parse() {
    const actionToken = this.tokenizer.getNext();
    if (actionToken === "Show stats for") {
      // this.action = new SHOW();
      this.type = "show stats";
      console.log(this.type);
    } else if (actionToken === "Start Session from") {
      // this.action = new START_SESSION();
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
