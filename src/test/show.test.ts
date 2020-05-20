import SHOW from "../ast/SHOW";
import STAT_TO_SHOW from "../ast/STAT_TO_SHOW";
import Tokenizer from "../lib/tokenizer";

test("Show parse should parse STAT_TO_SHOW if syntax is valid", () => {
  Tokenizer.makeTokenizer("Show minimum time spent on", [
    "Show",
    "minimum",
    "time spent on",
  ]);
  let show = new SHOW();
  show.parse();
  let expectedStatToShow = new STAT_TO_SHOW();
  expectedStatToShow.stat = "minimum";
  expectedStatToShow.statItem = "time spent on";
  expect(show.subjectModifer).toEqual(expectedStatToShow);
});
