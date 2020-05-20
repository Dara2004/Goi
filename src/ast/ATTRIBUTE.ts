import NODE from "./NODE";

export default class ATTRIBUTE extends NODE {
  attribute: string = "";

  parse() {
    this.attribute = this.tokenizer.getNext();
  }

  evaluate() {
    // stub
    throw new Error("Not implemented");
  }
}
