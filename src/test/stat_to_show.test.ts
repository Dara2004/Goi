import SHOW from "../ast/SHOW";
import STAT_TO_SHOW from "../ast/STAT_TO_SHOW";
import SELECTED_CARDS from "../ast/SELECTED_CARDS";
import Tokenizer from "../lib/tokenizer";
import * as constants from "../lib/constants";

test("StatToShow parse should parse if syntax is valid", () => {
  Tokenizer.makeTokenizer("Show minimum time spent on", constants.allTokens);
  let show = new SHOW();
  show.parse();
  let expectedStatToShow = new STAT_TO_SHOW();
  expectedStatToShow.stat = "minimum";
  expectedStatToShow.statItem = "time spent on";
  expect(show.subjectModifer).toEqual(expectedStatToShow);
});
