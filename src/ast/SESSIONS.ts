import NODE from "./NODE";
import { getAndCheckToken } from "../lib/tokenizer";

export default class SESSIONS extends NODE {
  type = "sessions";
  parseInteractivePrompt() {
    getAndCheckToken("past sessions");
  }
}
