import NODE from "./NODE";
import DECK from "./DECK";
import TAGS from "./TAGS";
import ATTRIBUTES, { isNextTokenIsAttribute } from "./ATTRIBUTES";

const invalidNameTokens = [":", "(", ")", ",", "NULLTOKEN"];

export default class CREATE_DECK extends NODE {
  tags: TAGS | null = null;
  attributes: ATTRIBUTES | null = null;
  deck: DECK | null = null;
  name: string = "";

  checkForAndParseTags() {
    const nextToken = this.tokenizer.checkNext().toLowerCase();
    if (nextToken === "add tags") {
      this.tags = new TAGS();
      this.tags.parse();
    }
  }

  checkForAndParseAttributes() {
    if (isNextTokenIsAttribute()) {
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
    let nextAttributeOrTag = true;
    while (this.tokenizer.moreTokens() && nextAttributeOrTag) {
      this.checkForAndParseTags();
      this.checkForAndParseAttributes();
      nextAttributeOrTag =
        isNextTokenIsAttribute() ||
        this.tokenizer.checkNext().toLowerCase() === "add tags";
    }
    if (this.tokenizer.moreTokens()) {
      this.checkForAndParseDeck();
    }
  }
}
