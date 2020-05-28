import React, { useState, useReducer } from "react";
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
import { Action, ActionType } from "../App";
import ErrorMessage from "./ErrorMessage";
import { Color } from "@material-ui/lab/Alert";

// for syntax highlighting
const literals = ["create deck", "(", ":", ")"];
type Props = {
  dispatch: React.Dispatch<Action>;
  initialText: string;
  isInSession: boolean;
  program: PROGRAM;
};

const debounceMillis = 1000;

function enoughTimeHasPassedSince(thenUnix: number): boolean {
  return Date.now() - thenUnix > 5000;
}

const successMessage = "Hooray!";

type SnackbarState =
  | {
      open: false;
      lastOpenedUnix: number;
    }
  | {
      open: true;
      severity: Color;
      message: string;
      lastOpenedUnix: number;
    };

function flipSnackbarState(
  setState: React.Dispatch<React.SetStateAction<SnackbarState>>,
  message: string,
  severity: Color
) {
  const lastOpenedUnix = Date.now();
  setState({
    open: false,
    lastOpenedUnix,
  });
  setState({
    open: true,
    lastOpenedUnix,
    message,
    severity,
  });
}

function handleSnackbar(
  state: SnackbarState,
  setState: React.Dispatch<React.SetStateAction<SnackbarState>>,
  message: string,
  severity: Color
) {
  if (enoughTimeHasPassedSince(state.lastOpenedUnix)) {
    flipSnackbarState(setState, message, severity);
  }
}

export default function CardEditor(props: Props) {
  const db = useDatabase();

  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    lastOpenedUnix: 0,
  });

  const { initialText, isInSession } = props;

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

        handleSnackbar(
          snackbarState,
          setSnackbarState,
          "Add some cards to your deck like this: '(1) front : back'",
          "info"
        );
      } else {
        if (snackbarState.open && snackbarState.severity !== "success") {
          setSnackbarState({
            lastOpenedUnix: Date.now(),
            message: successMessage,
            severity: "success",
            open: true,
          });
        } else {
          handleSnackbar(
            snackbarState,
            setSnackbarState,
            successMessage,
            "success"
          );
        }
        localStorage.setItem(astStrKey, JSON.stringify(program));
        // Trigger background reconciliation with DB
        reconcile(props.program, program, db)
          .then(() => debugDB("Background DB update complete!"))
          .catch((err) => debugDB("Error during reconciliation!", err));
        props.dispatch({ type: ActionType.CardEditorParseSuccess, program });
      }
    } catch (err) {
      debug(err);
      handleSnackbar(
        snackbarState,
        setSnackbarState,
        "Double check your input! Perhaps you're missing a colon (:)",
        "info"
      );
    }
  };

  return (
    <>
      <div className="card-editor">
        {isInSession ? (
          <div className="card-editor-codemirror card-hider">{initialText}</div>
        ) : (
          <CodeMirror
            value={initialText}
            options={{
              mode: "xml",
              theme: "ayu-mirage",
              lineNumbers: true,
            }}
            editorDidMount={(editor, value) => {
              highlight(editor, literals);
              props.dispatch({
                type: ActionType.SetCardEditor,
                cardEditor: editor,
              });
            }}
            onChange={handleChange}
            className="card-editor-codemirror"
          />
        )}
      </div>
      {snackbarState.open && (
        <ErrorMessage
          message={snackbarState.message}
          severity={snackbarState.severity}
        ></ErrorMessage>
      )}
    </>
  );
}
