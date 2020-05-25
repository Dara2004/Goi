import NODE from "./NODE";

export default class LIST extends NODE {
  option: string = "";

  parse() {
    this.tokenizer.getAndCheckToken("list");
    this.option = this.tokenizer.getNext();
    if (this.option !== "tags" && this.option !== "decks") {
      throw new Error("Invalid list option");
    }
  }
}
