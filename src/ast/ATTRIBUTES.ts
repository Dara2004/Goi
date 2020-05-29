import NODE from "./NODE";
import ATTRIBUTE from "./ATTRIBUTE";
import { checkNext, checkToken, moreTokens } from "../lib/tokenizer";

export function isNextTokenIsAttribute(): boolean {
  const nextToken = checkNext().toLowerCase();
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
      while (moreTokens() && !checkToken("add tags") && !checkToken("\\(")) {
        let attribute = new ATTRIBUTE();
        attribute.parse();
        this.attributes.push(attribute);
      }
    }
  }
}
