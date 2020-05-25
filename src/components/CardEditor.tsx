import React, { useEffect, useState, useRef } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/ayu-mirage.css";
import "codemirror/mode/xml/xml";
import { UnControlled as CodeMirror } from "react-codemirror2";
import PROGRAM from "../ast/PROGRAM";
import Tokenizer from "../lib/tokenizer";
import { deckCreationLiterals } from "../lib/constants";
import { highlight } from "../lib/highlighter";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import reconcile from "../lib/reconciler";
import { debug, debugDB } from "../lib/utils";
import { astStrKey, cardEditorStrKey } from "../lib/getIintialData";

// for syntax highlighting
const literals = ["create deck", "(", ":", ")"];

type Props = {
  dispatch;
  program: PROGRAM;
  initialText: string;
};

export default function CardEditor(props: Props) {
  const db = useDatabase();

  const handleChange = (editor: CodeMirror.Editor, data, value) => {
    highlight(editor, literals);

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
        debug("last deck is null, not sending dispatch");
      } else {
        localStorage.setItem(astStrKey, JSON.stringify(program));
        // Trigger background reconciliation with DB
        reconcile(props.program, program, db)
          .then(() => debugDB("Background DB update complete!"))
          .catch((err) => debugDB("Error during reconciliation!", err));
        props.dispatch({ type: "card editor parse success", program });
      }
    } catch (err) {
      debug(err);
    }
  };

  return (
    <>
      <div className="card-editor">
        <CodeMirror
          value={props.initialText}
          options={{
            mode: "xml",
            theme: "ayu-mirage",
            lineNumbers: true,
          }}
          editorDidMount={(editor, value) => {
            highlight(editor, literals);
            props.dispatch({ type: "set card editor", cardEditor: editor });
          }}
          onChange={handleChange}
          className="card-editor-codemirror"
        />
      </div>
    </>
  );
}
