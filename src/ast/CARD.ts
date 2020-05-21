import NODE from "./NODE";

export default class CARD extends NODE {
  cardNumber: number = 0;
  front: string = "";
  back: string = "";
  parse() {
    this.tokenizer.getAndCheckToken("\\(");
    const isIntString = this.tokenizer.checkToken("^[1-9]+[0-9]*$");
    if (isIntString) {
      this.cardNumber = parseInt(this.tokenizer.getNext());
      this.tokenizer.getAndCheckToken("\\)");
      this.front = this.tokenizer.getNext();
      this.tokenizer.getAndCheckToken(":");
      this.back = this.tokenizer.getNext();
    } else {
      throw new Error("Card number incorrect in Card");
    }
  }
}
