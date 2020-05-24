import React from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/yonce.css";
import "codemirror/mode/xml/xml";
import { UnControlled as CodeMirror } from "react-codemirror2";
import Tokenizer from "../lib/tokenizer";
import { deckCreationLiterals, allTokens } from "../lib/constants";
import COMMAND from "../ast/COMMAND";
import LIST from "../ast/LIST";
import LOAD_DECKS from "../ast/LOAD_DECKS";

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
        command.parse(); //commands = COMPLEX_COMMAND | HELP | LIST | EXPORT_DECK | LOAD_DECK
        if ((command.command as LIST).option) {
          props.dispatch({ type: "list", command: value.trim() });
          console.log(value);
        } else if ((command.command as LOAD_DECKS).isLoadDecks) {
          const fakeInput = document.createElement("input");
          fakeInput.type = "file";

          fakeInput.onchange = (e: any) => {
            const file = e.target.files[0];
            const fileReader = new FileReader();
            fileReader.readAsText(file, "UTF-8");

            fileReader.onload = (e) => {
              const deckCreationDSL = e.target.result as string;
              props.dispatch({
                type: "load decks",
                createDSLValue: deckCreationDSL,
              });
            };
          };
          fakeInput.click();
        }
        command.evaluate();
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
