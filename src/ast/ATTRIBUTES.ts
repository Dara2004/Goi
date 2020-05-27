import NODE from "./NODE";
import ATTRIBUTE from "./ATTRIBUTE";
import Tokenizer from "../lib/tokenizer";

export function isNextTokenIsAttribute(): boolean {
  const tokenizer = Tokenizer.getTokenizer();
  const nextToken = tokenizer.checkNext().toLowerCase();
  return (
    nextToken === "add color" ||
    nextToken === "add alignment" ||
    nextToken === "add direction"
  );
}
export default class ATTRIBUTES extends NODE {
  attributes: ATTRIBUTE[] = [];
  parse() {
    if (isNextTokenIsAttribute()) {
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
