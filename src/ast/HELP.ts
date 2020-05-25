import NODE from "./NODE";

export default class HELP extends NODE {
  type: string = "";
  parse() {
    this.type = "help";
    this.tokenizer.getAndCheckToken("help");
  }
}
