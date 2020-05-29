import NODE from "./NODE";
import { checkToken, getAndCheckToken, getNext } from "../lib/tokenizer";

export default class CARD extends NODE {
  cardNumber: number = 0;
  front: string = "";
  back: string = "";
  parse() {
    getAndCheckToken("\\(");
    const isIntString = checkToken("^[1-9]+[0-9]*$");
    if (isIntString) {
      this.cardNumber = parseInt(getNext());
      getAndCheckToken("\\)");
      this.front = getNext();
      getAndCheckToken(":");
      this.back = getNext();
    } else {
      throw new Error("Card number incorrect in Card");
    }
  }
}
