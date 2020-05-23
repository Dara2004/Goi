import React from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/ayu-mirage.css";
import "codemirror/mode/xml/xml";
import { UnControlled as CodeMirror } from "react-codemirror2";
import PROGRAM from "../ast/PROGRAM";
import Tokenizer from "../lib/tokenizer";
import { deckCreationLiterals } from "../lib/constants";
import { cardEditorStrKey } from "../App";
import { initialCodeEditorStr } from "../";

type Props = { dispatch };

export default function CardEditor(props: Props) {
  const handleChange = (editor, data, value) => {
    localStorage.setItem(cardEditorStrKey, value);
    // Parse it
    try {
      Tokenizer.makeTokenizer(value, deckCreationLiterals);
      const program = new PROGRAM();
      program.parse();
      // Check if the last deck in the program is null
      if (
        program.create_decks.length !== 0 &&
        program.create_decks[program.create_decks.length - 1].deck === null
      ) {
        console.log("last deck is null, not sending dispatch");
      } else {
        localStorage.setItem("programAST", JSON.stringify(program));
        props.dispatch({ type: "card editor parse success", program });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="card-editor">
        <CodeMirror
          value={
            initialCodeEditorStr ||
            `Create Deck Practice Final:
(1) Foo : Bar
(2) Bill : Gates
(3) Steve : Jobs
(4) Justin : Trudeau 
(5) Evan : You
`
          }
          options={{
            mode: "xml",
            theme: "ayu-mirage",
            lineNumbers: true,
          }}
          onChange={handleChange}
          className="card-editor-codemirror"
        />
      </div>
    </>
  );
}
