import NODE from "./NODE";

export default class SESSIONS extends NODE {
  parse() {
    this.tokenizer.getAndCheckToken("Sessions");
  }
}
