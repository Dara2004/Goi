import NODE from "./NODE";
import * as constants from "../lib/constants";

export default class STAT_TO_SHOW extends NODE {
  stat: string = "";
  statItem: string = "";

  parse() {
    this.stat = this.tokenizer.getNext();

    if (!constants.validStat.includes(this.stat)) {
      throw new Error("Invalid Stat");
    }

    this.statItem = this.tokenizer.getNext();

    if (!constants.validStatItem.includes(this.statItem)) {
      throw new Error("Invalid stat item");
    }
  }
}
