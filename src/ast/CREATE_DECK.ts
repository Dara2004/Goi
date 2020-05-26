import NODE from "./NODE";
import DECK from "./DECK";
import TAGS from "./TAGS";
import ATTRIBUTES from "./ATTRIBUTES";

const invalidNameTokens = [":", "(", ")", ",", "NULLTOKEN"];

export default class CREATE_DECK extends NODE {
  tags: TAGS | null = null;
  attributes: ATTRIBUTES | null = null;
  deck: DECK | null = null;
  name: string = "";

  checkForAndParseTags() {
    if (this.tokenizer.checkToken("add tags")) {
      this.tags = new TAGS();
      this.tags.parse();
    }
  }

  checkForAndParseAttributes() {
    const nextToken = this.tokenizer.checkNext().toLowerCase();
    if (
      nextToken === "add color" ||
      nextToken === "add alignment" ||
      nextToken === "add direction"
    ) {
      this.attributes = new ATTRIBUTES();
      this.attributes.parse();
    }
  }

  checkForAndParseDeck() {
    if (this.tokenizer.checkToken("\\(")) {
      this.deck = new DECK();
      this.deck.parse();
    }
  }

  parse() {
    //parse deck
    this.tokenizer.getAndCheckToken("create deck");
    const name = this.tokenizer.getNext();
    if (invalidNameTokens.includes(name)) {
      throw new Error("invalid deck name");
    }
    this.name = name;
    this.tokenizer.getAndCheckToken(":");
    while (this.tokenizer.moreTokens()) {
      this.checkForAndParseTags();
      this.checkForAndParseAttributes();
      this.checkForAndParseDeck();
      break;
    }
  }
}
