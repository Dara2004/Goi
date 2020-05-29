import NODE from "./NODE";
import DECK from "./DECK";
import TAGS from "./TAGS";
import ATTRIBUTES, { isNextTokenIsAttribute } from "./ATTRIBUTES";
import {
  checkNext,
  checkToken,
  getAndCheckToken,
  getNext,
  moreTokens,
} from "../lib/tokenizer";

const invalidNameTokens = [":", "(", ")", ",", "NULLTOKEN"];

export default class CREATE_DECK extends NODE {
  tags: TAGS | null = null;
  attributes: ATTRIBUTES | null = null;
  deck: DECK | null = null;
  name: string = "";

  checkForAndParseTags() {
    const nextToken = checkNext().toLowerCase();
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
    if (checkToken("\\(")) {
      this.deck = new DECK();
      this.deck.parse();
    }
  }

  parse() {
    //parse deck
    getAndCheckToken("create deck");
    const name = getNext();
    if (invalidNameTokens.includes(name)) {
      throw new Error("invalid deck name");
    }
    this.name = name;
    getAndCheckToken(":");
    let nextAttributeOrTag = true;
    while (moreTokens() && nextAttributeOrTag) {
      this.checkForAndParseTags();
      this.checkForAndParseAttributes();
      nextAttributeOrTag =
        isNextTokenIsAttribute() || checkNext().toLowerCase() === "add tags";
    }
    if (moreTokens()) {
      this.checkForAndParseDeck();
    }
  }
}
