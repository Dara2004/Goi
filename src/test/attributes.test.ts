import Tokenizer from "../lib/tokenizer";
import ATTRIBUTES from "../ast/ATTRIBUTES";

test("attributes parse should parse if syntax valid, Direction, Color, Alignment order", () => {
  Tokenizer.makeTokenizer(
    "add Direction: horizontal\n" +
      "add Color: red\n" +
      "add Alignment: center\n",
    ["add Direction", "add Color", "add Alignment", ",", ":", "(1)"],
    true
  );
  let attributes = new ATTRIBUTES();
  attributes.parse();

  const attributeArray = attributes.attributes.map((a) => a.attribute);
  const expectedAttributeArray = [
    { attributeType: "direction", value: "horizontal" },
    { attributeType: "color", value: "red" },
    { attributeType: "alignment", value: "center" },
  ];
  expect(attributes.attributes).toHaveLength(3);
  expect(attributeArray).toEqual(expectedAttributeArray);
});
