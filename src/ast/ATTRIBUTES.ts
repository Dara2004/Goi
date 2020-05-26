import NODE from "./NODE";
import ATTRIBUTE from "./ATTRIBUTE";

export default class ATTRIBUTES extends NODE {
  attributes: ATTRIBUTE[] = [];
  parse() {
    const areAttributes = this.tokenizer.checkToken(
      "add color|add alignment|add direction"
    );
    if (areAttributes) {
      while (
        this.tokenizer.moreTokens() &&
        !this.tokenizer.checkToken("add tags") &&
        !this.tokenizer.checkToken("\\(")
      ) {
        let attribute = new ATTRIBUTE();
        attribute.parse();
        this.attributes.push(attribute);
      }
    }
  }
}
