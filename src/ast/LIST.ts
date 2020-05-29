import NODE from "./NODE";
import { getAndCheckToken, getNext } from "../lib/tokenizer";

export default class LIST extends NODE {
  option: string = "";

  parse() {
    getAndCheckToken("list");
    this.option = getNext();
    if (this.option !== "tags" && this.option !== "decks") {
      throw new Error("Invalid list option");
    }
  }
}
