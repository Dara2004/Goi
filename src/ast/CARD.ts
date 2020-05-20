import NODE from "./NODE";

export default class CARD extends NODE {
  id: number = 0;
  front: string = "";
  back: string = "";
  parse() {
    this.tokenizer.getAndCheckToken("\\(");
    this.id = parseInt(this.tokenizer.getNext());
    this.tokenizer.getAndCheckToken("\\)");
    this.front = this.tokenizer.getNext();
    this.tokenizer.getAndCheckToken(":");
    this.back = this.tokenizer.getNext();
  }

  evaluate() {
    // stub
    throw new Error("Not implemented");
  }
}
