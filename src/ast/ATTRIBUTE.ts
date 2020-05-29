import NODE from "./NODE";
import {
  nextTokenMatchesRegex,
  getAndCheckToken,
  getNextToken,
} from "../lib/tokenizer";

interface AttributeObj {
  attributeType: string;
  value: string;
}

export default class ATTRIBUTE extends NODE {
  attribute: AttributeObj = { attributeType: "", value: "" };

  parse() {
    const currentAttribute = getNextToken().toLowerCase();
    getAndCheckToken(":");
    switch (currentAttribute) {
      case "add alignment":
        this.attribute.attributeType = "alignment";
        if (nextTokenMatchesRegex("center|right|left")) {
          this.attribute.value = getNextToken();
        } else {
          throw new Error("Alignment Attribute is not valid");
        }
        break;
      case "add direction":
        this.attribute.attributeType = "direction";
        if (nextTokenMatchesRegex("horizontal|vertical")) {
          this.attribute.value = getNextToken();
        } else {
          throw new Error("Direction Attribute is not valid");
        }
        break;
      case "add color":
        this.attribute.attributeType = "color";
        if (nextTokenMatchesRegex("red|blue|yellow|purple|green|grey|brown")) {
          this.attribute.value = getNextToken();
        } else {
          throw new Error("Color Attribute is not valid");
        }
        break;
      default:
        return;
    }
  }
}
