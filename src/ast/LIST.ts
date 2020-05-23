import NODE from "./NODE";

export default class LIST extends NODE {
  option: string = "";

  parse() {
    this.tokenizer.getAndCheckToken("List");
    this.option = this.tokenizer.getNext();
    if (this.option !== "Tags" && this.option !== "Decks") {
      throw new Error("Invalid list option");
    }
  }
}
