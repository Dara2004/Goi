import Tokenizer from "../lib/tokenizer";
import CREATE_STYLE from "../ast/CREATE_STYLE";

test("create style parse should parse if syntax valid", () => {
  Tokenizer.makeTokenizer(
    "Create Style myStyle:\n" +
      "Color = Red\n" +
      "Direction = Horizontal\n" +
      "Align = Center",
    ["Create Style", ":"],
    true
  );
  let createStyle = new CREATE_STYLE();
  createStyle.parse();
  expect(createStyle.name).toEqual("myStyle");
  expect(createStyle.styles).toHaveLength(1);
});
