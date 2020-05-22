import NODE from "./NODE";

interface AttributeObj {
  attributeType: string;
  value: string;
}

export default class ATTRIBUTE extends NODE {
  attribute: AttributeObj = { attributeType: "", value: "" };

  parse() {
    const currentAttribute = this.tokenizer.getNext();
    this.tokenizer.getAndCheckToken(":");
    switch (currentAttribute) {
      case "add Alignment":
        this.attribute.attributeType = "alignment";
        if (this.tokenizer.checkToken("center|right|left")) {
          this.attribute.value = this.tokenizer.getNext();
        } else {
          throw new Error("Alignment Attribute is not valid");
        }
        break;
      case "add Direction":
        this.attribute.attributeType = "direction";
        if (this.tokenizer.checkToken("horizontal|vertical")) {
          this.attribute.value = this.tokenizer.getNext();
        } else {
          throw new Error("Direction Attribute is not valid");
        }
        break;
      case "add Color":
        this.attribute.attributeType = "color";
        if (
          this.tokenizer.checkToken("red|blue|yellow|purple|green|grey|brown")
        ) {
          this.attribute.value = this.tokenizer.getNext();
        } else {
          throw new Error("Color Attribute is not valid");
        }
        break;
      default:
        return;
    }
  }
}
