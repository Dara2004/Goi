import NODE from "./NODE";

export default class HELP extends NODE {
  parse() {
    this.tokenizer.getAndCheckToken("Help");
  }
}
