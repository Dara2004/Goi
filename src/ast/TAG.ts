import NODE from "./NODE";

export default class TAG extends NODE {
  tagName: string = "";
  parse() {
    this.tagName = this.tokenizer.getNext();
  }
}
