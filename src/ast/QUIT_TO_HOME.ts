import NODE from "./NODE";

export default class QUIT_TO_HOME extends NODE {
  parse() {
    this.tokenizer.getAndCheckToken("^quit$|^back to home$");
  }
}
