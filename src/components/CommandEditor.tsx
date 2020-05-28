import React from "react";
import { highlight } from "../lib/highlighter";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/yonce.css";
import { UnControlled as CodeMirror } from "react-codemirror2";
import Tokenizer from "../lib/tokenizer";
import { allTokens as literals } from "../lib/constants";
import COMMAND from "../ast/COMMAND";
import COMPLEX_COMMAND from "../ast/COMPLEX_COMMAND";
import { Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SUBJECT_MODIFIER from "../ast/SUBJECT_MODIFIER";
import DECKS from "../ast/DECKS";
import { Action, ActionType } from "../App";
import { SubjectType as Subject } from "../ast/SUBJECT";
import LIST from "../ast/LIST";
import { Filter } from "../model/query";
import TAGS from "../ast/TAGS";

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
    <h4>To download your decks:</h4> Enter 'export decks'
    <h4>To load decks from your computer:</h4> Enter 'load decks'
    <h4>To go back to Home:</h4> Enter 'quit' or 'back to home'
  </div>
);

type Props = { dispatch: React.Dispatch<Action> };

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

  const handleCommandChange = (editor: CodeMirror.Editor, data, value) => {
    highlight(editor, literals);
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
        Tokenizer.makeTokenizer(value, literals);
        const command = new COMMAND();
        command.parse(); //commands = COMPLEX_COMMAND | HELP | LIST
        console.log(command.command);
        if (command.type === "list") {
          const listNode = command.command as LIST;
          if (listNode.option === "decks") {
            props.dispatch({ type: ActionType.List, listOption: "decks" });
          } else if (listNode.option === "tags") {
            props.dispatch({ type: ActionType.List, listOption: "tags" }); // not implemented
          } else {
            console.log("Unexpected list option: ", listNode.option);
          }
        } else if (command.type === "help") {
          isHelpCommand = true;
        } else if (command.type === "export decks") {
          command.evaluate();
        } else if (command.type === "quit to home") {
          props.dispatch({ type: ActionType.QuitToHome });
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
                type: ActionType.LoadDecks,
                createDSLValue: deckCreationDSL,
              });
            };
          };
          fakeInput.click();
        } else if (isStartSessionOrShowStats(command)) {
          const modifier = (command.command as COMPLEX_COMMAND)
            .subjectModfier as SUBJECT_MODIFIER;
          if (modifier) {
            const isTagsSubject =
              (command.command as COMPLEX_COMMAND).subject.subjectType ===
              "tags";
            props.dispatch({
              type:
                startSessionOrStats === "start session"
                  ? ActionType.StartSession
                  : ActionType.ShowStats,
              limit: modifier.limit,
              filter: modifier.filter as Filter,
              isLimitAppliedToCards: modifier.selectCards,
              deckNames:
                !isTagsSubject &&
                ((command.command as COMPLEX_COMMAND).subject.subject as DECKS)
                  .decks,
              subject: (command.command as COMPLEX_COMMAND).subject.subjectType,
              tagNames:
                isTagsSubject &&
                ((command.command as COMPLEX_COMMAND).subject
                  .subject as TAGS).tags.map((t) => t.tagName),
            });
          }
        }
      } catch (err) {
        console.log(err);
        props.dispatch({
          type: ActionType.CommandNotFound,
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
          value={"> Help"}
          options={{
            mode: "xml",
            theme: "yonce",
            lineNumbers: true,
          }}
          editorDidMount={(editor, value) => {
            highlight(editor, literals);
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
