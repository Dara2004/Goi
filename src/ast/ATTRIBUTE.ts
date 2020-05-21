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
        this.attribute.value = this.tokenizer.getNext();
        break;
      case "add Direction":
        this.attribute.attributeType = "direction";
        this.attribute.value = this.tokenizer.getNext();
        break;
      case "add Color":
        this.attribute.attributeType = "color";
        this.attribute.value = this.tokenizer.getNext();
        break;
      default:
        return;
    }
  }

  evaluate() {
    // stub
    throw new Error("Not implemented");
  }
}
