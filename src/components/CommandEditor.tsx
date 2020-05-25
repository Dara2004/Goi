import React from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/yonce.css";
import "codemirror/mode/xml/xml";
import { UnControlled as CodeMirror } from "react-codemirror2";
import Tokenizer from "../lib/tokenizer";
import { deckCreationLiterals, allTokens } from "../lib/constants";
import COMMAND from "../ast/COMMAND";
import LIST from "../ast/LIST";
import COMPLEX_COMMAND from "../ast/COMPLEX_COMMAND";
import START_SESSION from "../ast/START_SESSION";
import HELP from "../ast/HELP";
import { Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SUBJECT_MODIFIER from "../ast/SUBJECT_MODIFIER";
import DECK from "../ast/DECK";
import DECKS from "../ast/DECKS";
import LOAD_DECKS from "../ast/LOAD_DECKS";

const helpMsg = (
  <div
    style={{
      fontSize: "14px",
      lineHeight: "9px",
    }}
  >
    <h4>To start a session from decks:</h4>
    Start Session from [choose ‘random card’, ect ] from Decks: [choose 1 or
    more deck names]
    <h4>To start a session from tags:</h4>
    Start Session from [choose ‘random card’, ect ] from Tags: [choose 1 or more
    tag names]
    <h4>To show stats:</h4> Show stats for [choose one or more ‘best scores
    for’, ‘average time spent on’, ‘worst scores for’] Decks: [choose 1 or more
    deck names]
  </div>
);

type Props = { dispatch };

let startSessionOrStats: string = "";
function isStartSessionOrShowStats(command: COMMAND): boolean {
  if (
    ((command.command as COMPLEX_COMMAND).subjectModfier as SUBJECT_MODIFIER)
      .type === "start session"
  ) {
    startSessionOrStats = "start session";
    return true;
  } else if (
    ((command.command as COMPLEX_COMMAND).subjectModfier as SUBJECT_MODIFIER)
      .type === "show stats"
  ) {
    startSessionOrStats = "show stats";
    return true;
  }
  return false;
}

export default function CommandEditor(props: Props) {
  const [openHelp, setOpenHelp] = React.useState(false);

  const handleCloseHelp = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenHelp(false);
  };

  const handleCommandChange = (editor, data, value) => {
    if (!value.startsWith("> ")) {
      //reset the cursor if user tries to delete
      editor.getDoc().setValue("> ");
      editor.getDoc().setCursor(2);
    }

    if (value.includes("\n")) {
      let isHelpCommand = false;
      //after user hits enter, reset the cursor
      // Parse the value
      try {
        Tokenizer.makeTokenizer(value, allTokens);
        const command = new COMMAND();
        command.parse(); //commands = COMPLEX_COMMAND | HELP | LIST
        console.log(command.command);
        if (command.type === "list") {
          props.dispatch({ type: "list", command: value.trim() });
        } else if (command.type === "help") {
          isHelpCommand = true;
        } else if (command.type === "export decks") {
          command.evaluate();
        } else if (command.type === "load decks") {
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
        } else if (isStartSessionOrShowStats(command)) {
          const modifier = (command.command as COMPLEX_COMMAND)
            .subjectModfier as SUBJECT_MODIFIER;
          if (modifier) {
            props.dispatch({
              type:
                startSessionOrStats === "start session"
                  ? "start session"
                  : "show stats",
              limit: modifier.limit,
              filter: modifier.filter,
              selectCards: modifier.selectCards,
              deckNames: ((command.command as COMPLEX_COMMAND).subject
                .subject as DECKS).decks,
            });
          }
        }
      } catch (err) {
        console.log(err);
        props.dispatch({
          type: "command not found",
        });
      }
      if (isHelpCommand) {
        setOpenHelp(true);
      }
      editor.getDoc().setValue("> ");
      editor.getDoc().setCursor(2);
    }
  };

  return (
    <>
      <div className="command-editor">
        <CodeMirror
          value={"> Start Session from Decks: Practice Final"}
          options={{
            mode: "xml",
            theme: "yonce",
            lineNumbers: true,
          }}
          onChange={handleCommandChange}
        />
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={openHelp}
        autoHideDuration={180000}
        onClose={handleCloseHelp}
        message={helpMsg}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseHelp}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </>
  );
}
