import React from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import { UnControlled as CodeMirror } from "react-codemirror2";
import PROGRAM from "../ast/PROGRAM";
import Tokenizer from "../lib/tokenizer";
import { deckCreationLiterals } from "../lib/constants";
import { cardEditorStrKey } from "../App";
import { initialCodeEditorStr } from "../";
import { getHighlights } from "../lib/highlighter";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import reconcile from "../lib/reconciler";
import { debug } from "../lib/utils";

type Props = { dispatch; program };

export default function CardEditor(props: Props) {
  const db = useDatabase();

  const handleChange = (editor: CodeMirror.Editor, data, value) => {
    const highlights = getHighlights(value, ["create deck", "(", ":", ")"]);
    const doc = editor.getDoc();
    highlights.forEach((highlight) => {
      doc.markText(
        { line: highlight.lineNumber, ch: highlight.charStart },
        { line: highlight.lineNumber, ch: highlight.charEnd },
        { className: "syntax-highlight" }
      );
    });
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
        // Trigger background reconciliation with DB
        reconcile(props.program, program, db)
          .then(() => debug("Background DB update complete!"))
          .catch((err) => debug("Error during reconciliation!", err));
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
            theme: "material",
            lineNumbers: true,
          }}
          onChange={handleChange}
          className="card-editor-codemirror"
        />
      </div>
    </>
  );
}
