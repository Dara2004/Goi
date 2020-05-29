import NODE from "./NODE";
import {
  nextTokenMatchesRegex,
  getAndCheckToken,
  getNextToken,
} from "../lib/tokenizer";

export default class CARD extends NODE {
  cardNumber: number = 0;
  front: string = "";
  back: string = "";
  parse() {
    getAndCheckToken("\\(");
    const isIntString = nextTokenMatchesRegex("^[1-9]+[0-9]*$");
    if (isIntString) {
      this.cardNumber = parseInt(getNextToken());
      getAndCheckToken("\\)");
      this.front = getNextToken();
      getAndCheckToken(":");
      this.back = getNextToken();
    } else {
      throw new Error("Card number incorrect in Card");
    }
  }
}
