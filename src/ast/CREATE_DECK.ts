import NODE from "../lib/NODE";
import DECK from "./DECK";
import TAGS from "./TAGS";
import STYLE from "./STYLE";

const invalidNameTokens = ["with Tags", "using Style", "("];

export default class CREATE_DECK extends NODE {
  // style: STYLE;
  tags: TAGS | null = null;
  style: STYLE | null = null;
  deck: DECK | null = null;
  name: string = "";

  checkForAndParseTags(): boolean {
    if (this.tokenizer.checkToken("with Tags")) {
      this.tags = new TAGS();
      this.tags.parse();
      return true;
    }
    return false;
  }

  checkForAndParseStyle(): boolean {
    if (this.tokenizer.checkToken("using Style")) {
      this.style = new STYLE();
      this.style.parse();
      return true;
    }
    return false;
  }

  parse() {
    //parse deck
    this.tokenizer.getAndCheckToken("Create Deck");
    const name = this.tokenizer.getNext();
    if (invalidNameTokens.includes(name)) {
      throw new Error("invalid deck name");
    }
    this.name = name;
    if (this.checkForAndParseTags()) {
      this.checkForAndParseStyle();
    } else if (this.checkForAndParseStyle()) {
      this.checkForAndParseTags();
    }
    this.deck = new DECK();
    this.deck.parse();
  }

  evaluate() {
    // stub
    throw new Error("Not implemented");
  }
}
