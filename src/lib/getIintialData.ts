import Tokenizer from "./tokenizer";
import { deckCreationLiterals } from "./constants";
import PROGRAM from "../ast/PROGRAM";

// Local storage keys
export const astStrKey = "programAST";
export const cardEditorStrKey = "cardEditorStrKey";

// Change here to
const defaultText = `Create Deck Practice Final:
(1) Foo : Bar
(2) Bill : Gates
(3) Steve : Jobs
(4) Justin : Trudeau 
(5) Evan : You
`;

type InitialData = {
  isFirstTimeUser: boolean;
  initialText: string;
  initialProgram: PROGRAM;
};

/**
 * @returns initial data for the card editor
 */
export function getInitialData(): InitialData {
  const savedText = localStorage.getItem(cardEditorStrKey);
  const lastAstJsonStr = localStorage.getItem(astStrKey);
  if (savedText) {
    return {
      isFirstTimeUser: false,
      initialText: savedText,
      initialProgram: JSON.parse(lastAstJsonStr),
    };
  } else {
    // Parse the example into an AST
    Tokenizer.makeTokenizer(defaultText, deckCreationLiterals);
    const program = new PROGRAM();
    program.parse();
    localStorage.setItem(cardEditorStrKey, defaultText);
    localStorage.setItem(astStrKey, JSON.stringify(program));
    return {
      isFirstTimeUser: true,
      initialText: defaultText,
      initialProgram: program,
    };
  }
}
