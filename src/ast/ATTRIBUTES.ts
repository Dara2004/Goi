import NODE from "./NODE";
import ATTRIBUTE from "./ATTRIBUTE";
import {
  checkNextToken,
  nextTokenMatchesRegex,
  isMoreTokens,
} from "../lib/tokenizer";

export function isNextTokenIsAttribute(): boolean {
  const nextToken = checkNextToken().toLowerCase();
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
        isMoreTokens() &&
        !nextTokenMatchesRegex("add tags") &&
        !nextTokenMatchesRegex("\\(")
      ) {
        let attribute = new ATTRIBUTE();
        attribute.parse();
        this.attributes.push(attribute);
      }
    }
  }
}
