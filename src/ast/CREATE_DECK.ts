import NODE from "./NODE";
import DECK from "./DECK";
import TAGS from "./TAGS";
import ATTRIBUTES, { isNextTokenIsAttribute } from "./ATTRIBUTES";
import {
  checkNextToken,
  nextTokenMatchesRegex,
  getAndCheckToken,
  getNextToken,
  isMoreTokens,
} from "../lib/tokenizer";

const invalidNameTokens = [":", "(", ")", ",", "NULLTOKEN"];

export default class CREATE_DECK extends NODE {
  tags: TAGS | null = null;
  attributes: ATTRIBUTES | null = null;
  deck: DECK | null = null;
  name: string = "";

  checkForAndParseTags() {
    const nextToken = checkNextToken().toLowerCase();
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
    if (nextTokenMatchesRegex("\\(")) {
      this.deck = new DECK();
      this.deck.parse();
    }
  }

  parse() {
    //parse deck
    getAndCheckToken("create deck");
    const name = getNextToken();
    if (invalidNameTokens.includes(name)) {
      throw new Error("invalid deck name");
    }
    this.name = name;
    getAndCheckToken(":");
    let nextAttributeOrTag = true;
    while (isMoreTokens() && nextAttributeOrTag) {
      this.checkForAndParseTags();
      this.checkForAndParseAttributes();
      nextAttributeOrTag =
        isNextTokenIsAttribute() ||
        checkNextToken().toLowerCase() === "add tags";
    }
    if (isMoreTokens()) {
      this.checkForAndParseDeck();
    }
  }
}
