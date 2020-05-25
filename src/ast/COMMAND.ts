import NODE from "./NODE";
import COMPLEX_COMMAND from "./COMPLEX_COMMAND";
import HELP from "./HELP";
import LIST from "./LIST";
import EXPORT_DECKS from "./EXPORT_DECKS";
import LOAD_DECKS from "./LOAD_DECKS";

export default class COMMAND extends NODE {
  type: string = "";
  command:
    | COMPLEX_COMMAND
    | HELP
    | LIST
    | EXPORT_DECKS
    | LOAD_DECKS
    | null = null;

  parse() {
    const nextToken = this.tokenizer.checkNext();
    if (nextToken === "help") {
      this.command = new HELP();
      this.type = "help";
    } else if (nextToken === "list") {
      this.command = new LIST();
      this.type = "list";
    } else if (nextToken === "export decks") {
      this.command = new EXPORT_DECKS();
      this.type = "export decks";
    } else if (nextToken === "load decks") {
      this.command = new LOAD_DECKS();
      this.type = "load decks";
    } else {
      this.command = new COMPLEX_COMMAND();
      this.type = "complex command";
    }
    if (this.command === null) {
      throw new Error("Invalid command specified");
    }
    this.command.parse();
  }

  evaluate() {
    this.command.evaluate();
  }
}
