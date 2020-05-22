import NODE from "./NODE";
import COMPLEX_COMMAND from "./COMPLEX_COMMAND";
import HELP from "./HELP";
import LIST from "./LIST";

export default class COMMAND extends NODE {
  command: COMPLEX_COMMAND | HELP | LIST | null = null;
  parse() {
    const nextToken = this.tokenizer.checkNext();
    if (nextToken === "Help") {
      this.command = new HELP();
    } else if (nextToken === "List:") {
      this.command = new LIST();
    } else {
      this.command = new COMPLEX_COMMAND();
    }
    if (this.command === null) {
      throw new Error("Invalid command specified");
    }
    this.command.parse();
  }
}
