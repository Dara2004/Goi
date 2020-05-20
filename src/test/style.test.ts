import Tokenizer from "../lib/tokenizer";
import STYLE from "../ast/STYLE";

test("style parse should parse if syntax valid", () => {
  Tokenizer.makeTokenizer(
    ":\n" + "Color = Red\n" + "Direction = Horizontal\n" + "Align = Center",
    [":"],
    true
  );
  let style = new STYLE();
  style.parse();
  const expectedAttributeArray = [
    "Color = Red",
    "Direction = Horizontal",
    "Align = Center",
  ];
  expect(style.attributes).toHaveLength(3);
  expect(style.attributes.map((a) => a.attribute)).toEqual(
    expectedAttributeArray
  );
});
