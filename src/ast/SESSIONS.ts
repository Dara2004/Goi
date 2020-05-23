import NODE from "./NODE";

export default class SESSIONS extends NODE {
  parseInteractivePrompt() {
    this.tokenizer.getAndCheckToken("Past Sessions");
  }
}
