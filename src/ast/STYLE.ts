import NODE from "./NODE";
import ATTRIBUTE from "./ATTRIBUTE";

export default class STYLE extends NODE {
  attributes: ATTRIBUTE[] = [];
  parse() {
    this.tokenizer.getAndCheckToken(":");
    while (
      this.tokenizer.moreTokens() &&
      this.tokenizer.checkToken(
        "Direction =.*|Font =.*|Align =.*|Color =.*|Colour =.*"
      )
    ) {
      let attribute = new ATTRIBUTE();
      attribute.parse();
      this.attributes.push(attribute);
    }
  }

  evaluate() {
    // stub
    throw new Error("Not implemented");
  }
}
