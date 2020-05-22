import React, { useState } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/yonce.css";
import "codemirror/mode/xml/xml";
import { UnControlled as CodeMirror } from "react-codemirror2";
import Tokenizer from "../lib/tokenizer";
import { deckCreationLiterals, allTokens } from "../lib/constants";
import COMMAND from "../ast/COMMAND";
import LIST from "../ast/LIST";

type Props = { dispatch };

export default function CommandEditor(props: Props) {
  const handleCommandChange = (editor, data, value) => {
    if (!value.startsWith("> ")) {
      //reset the cursor if user tries to delete
      editor.getDoc().setValue("> ");
      editor.getDoc().setCursor(2);
    }
    if (value.includes("\n")) {
      //after user hits enter, reset the cursor
      // Parse the value
      try {
        Tokenizer.makeTokenizer(value, allTokens);
        const command = new COMMAND();
        command.parse(); //commands = COMPLEX_COMMAND | HELP | LIST
        if ((command.command as LIST).option) {
          props.dispatch({ type: "list", command: value.trim() });
          console.log(value);
        }
      } catch (err) {
        console.log(err);
      }
      editor.getDoc().setValue("> ");
      editor.getDoc().setCursor(2);
    }
  };

  return (
    <>
      <div className="command-editor">
        <CodeMirror
          // value={"> "}
          value={"> Start session"}
          options={{
            mode: "xml",
            theme: "yonce",
            lineNumbers: true,
          }}
          onChange={handleCommandChange}
        />
      </div>
    </>
  );
}
