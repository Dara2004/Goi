import NODE from "./NODE";
import COMPLEX_COMMAND from "./COMPLEX_COMMAND";
import HELP from "./HELP";
import LIST from "./LIST";
import EXPORT_DECKS from "./EXPORT_DECKS";
import LOAD_DECKS from "./LOAD_DECKS";

export default class COMMAND extends NODE {
  command:
    | COMPLEX_COMMAND
    | HELP
    | LIST
    | EXPORT_DECKS
    | LOAD_DECKS
    | null = null;

  parse() {
    const nextToken = this.tokenizer.checkNext();
    if (nextToken === "Help") {
      this.command = new HELP();
    } else if (nextToken === "List:") {
      this.command = new LIST();
    } else if (nextToken === "Export decks") {
      this.command = new EXPORT_DECKS();
    } else if (nextToken === "Load decks") {
      this.command = new LOAD_DECKS();
    } else {
      this.command = new COMPLEX_COMMAND();
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
