import NODE from "./NODE";
import { getNext } from "../lib/tokenizer";

export default class TAG extends NODE {
  tagName: string = "";
  parse() {
    this.tagName = getNext();
  }
}
