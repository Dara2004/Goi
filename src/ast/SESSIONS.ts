import NODE from "./NODE";

export default class SESSIONS extends NODE {
  type = "sessions";
  parseInteractivePrompt() {
    this.tokenizer.getAndCheckToken("past sessions");
  }
}
