import NODE from "./NODE";
import SELECTED_CARDS from "./SELECTED_CARDS";
import STAT_TO_SHOW from "./STAT_TO_SHOW";
import * as constants from "../lib/constants";

export default class SHOW extends NODE {
  subjectModifer: SELECTED_CARDS | STAT_TO_SHOW | null = null;
  limit: number = NaN;

  parse() {
    this.tokenizer.getAndCheckToken("Show stats for");
    let nextToken = this.tokenizer.checkNext();
    if (!isNaN(Number(nextToken))) {
      this.limit = Number(this.tokenizer.getNext());
      nextToken = this.tokenizer.checkNext();
    }
    if (constants.validCardFilter.includes(nextToken)) {
      this.subjectModifer = new SELECTED_CARDS();
    } else if (constants.validStat.includes(nextToken)) {
      this.subjectModifer = new STAT_TO_SHOW();
    } else {
      throw new Error("Invalid Subject Modifier");
    }
    this.subjectModifer.parse();
  }

  evaluate() {
    //stub
    throw new Error("Not implemented");
  }
}
