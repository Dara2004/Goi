import NODE from "./NODE";
import { getAndCheckToken } from "../lib/tokenizer";

export default class HELP extends NODE {
  type: string = "";
  parse() {
    this.type = "help";
    getAndCheckToken("help");
  }
}
