import NODE from "./NODE";
import { checkToken, getAndCheckToken, getNext } from "../lib/tokenizer";

interface AttributeObj {
  attributeType: string;
  value: string;
}

export default class ATTRIBUTE extends NODE {
  attribute: AttributeObj = { attributeType: "", value: "" };

  parse() {
    const currentAttribute = getNext().toLowerCase();
    getAndCheckToken(":");
    switch (currentAttribute) {
      case "add alignment":
        this.attribute.attributeType = "alignment";
        if (checkToken("center|right|left")) {
          this.attribute.value = getNext();
        } else {
          throw new Error("Alignment Attribute is not valid");
        }
        break;
      case "add direction":
        this.attribute.attributeType = "direction";
        if (checkToken("horizontal|vertical")) {
          this.attribute.value = getNext();
        } else {
          throw new Error("Direction Attribute is not valid");
        }
        break;
      case "add color":
        this.attribute.attributeType = "color";
        if (checkToken("red|blue|yellow|purple|green|grey|brown")) {
          this.attribute.value = getNext();
        } else {
          throw new Error("Color Attribute is not valid");
        }
        break;
      default:
        return;
    }
  }
}
