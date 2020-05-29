import NODE from "./NODE";
import { getNextToken } from "../lib/tokenizer";

export default class TAG extends NODE {
  tagName: string = "";
  parse() {
    this.tagName = getNextToken();
  }
}
