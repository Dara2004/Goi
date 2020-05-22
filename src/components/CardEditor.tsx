import React from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import { UnControlled as CodeMirror } from "react-codemirror2";
import PROGRAM from "../ast/PROGRAM";
import Tokenizer from "../lib/tokenizer";
import { deckCreationLiterals } from "../lib/constants";

type Props = { dispatch };
export default function CardEditor(props: Props) {
  return (
    <>
      <div className="card-editor">
        <CodeMirror
          value={`Create Deck Practice Final:
(1) Foo : Bar
(2) Bill : Gates
(3) Steve : Jobs
(4) Justin : Trudeau 
(5) Evan : You
`}
          options={{
            mode: "xml",
            theme: "material",
            lineNumbers: true,
          }}
          onChange={(editor, data, value) => {
            // Parse it
            try {
              Tokenizer.makeTokenizer(value, deckCreationLiterals);
              const program = new PROGRAM();
              program.parse();
              // Check if the last deck in the program is null
              if (
                program.create_decks[program.create_decks.length - 1].deck ===
                null
              ) {
                console.log("last deck is null, not sending dispatch");
              } else {
                props.dispatch({ type: "card editor parse success", program });
              }
            } catch (err) {
              console.log(err);
            }
          }}
          className="card-editor-codemirror"
        />
      </div>
    </>
  );
}
