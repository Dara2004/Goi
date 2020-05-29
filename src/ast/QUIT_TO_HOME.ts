import NODE from "./NODE";
import { getAndCheckToken } from "../lib/tokenizer";

export default class QUIT_TO_HOME extends NODE {
  parse() {
    getAndCheckToken("^quit$|^back to home$");
  }
}
