import React, { useReducer } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import DeckView from "./components/DeckView";
import CardEditor from "./components/CardEditor";
import CommandEditor from "./components/CommandEditor";
import Session from "./components/Session";
import Statistics from "./components/Statistics";
import ListView from "./components/ListView";
import PROGRAM from "./ast/PROGRAM";
import { getInitialData } from "./lib/getIintialData";
import { createOrUpdateAllDecks } from "./lib/reconciler";

import DeckViewDetails from "./components/DeckViewDetails";
import ErrorMessage from "./components/ErrorMessage";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import {
  checkSessionCommandError,
  getCardsForSession,
  FlashCard,
} from "./lib/sessionHelperFunctions";
import PostSessionSummary from "./components/PostSessionSummary";
import { CircularProgress } from "@material-ui/core";
import {
  getSelectedDecks,
  deckFilter,
  Filter,
  getCardsFromSelectedDecks,
} from "./model/query";
import { debug, randomizeCards } from "./lib/utils";

const CustomListView = ({ program, dispatch }) => {
  return (
    <div className="card-view-container">
      <div className="card-view">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            justifyItems: "center",
          }}
        >
          <ListView
            deckNames={program.create_decks.map((deck) => {
              return deck.name;
            })}
            dispatch={dispatch}
          ></ListView>
        </div>
      </div>
    </div>
  );
};

// What screen the UI should be showing
export enum View {
  DECK,
  STATS,
  SESSION,
  POST_SESSION,
  LIST,
  DECK_DETAIL,
  ERROR,
  LOADING,
}

export enum Subject {
  Decks = "decks",
  Sessions = "sessions",
  Tags = "tags", // not supported yet
  Undefined = "undefined",
}

export type ComplexCommandParams = {
  limit?: number;
  filter?: Filter;
  isLimitAppliedToCards?: boolean;
  deckNames?: string[];
  subject: Subject;
};

type State = {
  view: View;
  program: PROGRAM;
  cardEditor?: CodeMirror.Editor;
  subjectToList: Subject;
  deckToViewDetail?: string;
  complexCommandParams?: ComplexCommandParams;
};

export enum ActionType {
  SetCardEditor = "set card editor",
  CardEditorParseSuccess = "card editor parse success",
  StartSession = "start session",
  SessionIsReady = "session is ready",
  PostSession = "post session",
  List = "list",
  ViewDeckDetail = "view deck detail",
  ShowStats = "show stats",
  LoadDecks = "load decks",
  CommandNotFound = "command not found",
  QuitToHome = "quit to home",
}

export type Action =
  | {
      type: ActionType.SetCardEditor; // Enables "Load decks" to work
      cardEditor: CodeMirror.Editor;
    }
  | {
      type: ActionType.CardEditorParseSuccess;
      program: PROGRAM;
    }
  | {
      type: ActionType.StartSession;
      limit?: number;
      filter?: Filter;
      isLimitAppliedToCards?: boolean;
      deckNames?: string[];
      subject: Subject;
    }
  | {
      type: ActionType.SessionIsReady;
      deckNames?: string[];
      cards: FlashCard[];
    }
  | {
      type: ActionType.List;
      listOption: "decks" | "tags";
      // tags not implemented
    }
  | {
      type: ActionType.ViewDeckDetail;
      deckName: string;
    }
  | {
      type: ActionType.ShowStats;
      limit: number;
      filter?: Filter;
      isLimitAppliedToCards?: boolean;
      deckNames?: string[];
      subject: Subject;
    }
  | {
      type: ActionType.LoadDecks;
      createDSLValue: string;
    }
  | {
      type: ActionType.QuitToHome;
    }
  | {
      type: ActionType.CommandNotFound;
    }
  | {
      type: ActionType.PostSession;
    }; // Add actions here

const reducer = (state: State, action: Action): State => {
  debug("Dispatched to App: ", action);
  switch (action.type) {
    // Add action handlers here
    case "set card editor": {
      return {
        ...state,
        cardEditor: action.cardEditor,
      };
    }
    case "card editor parse success": {
      return {
        ...state,
        program: action.program,
        view: View.DECK,
      };
    }
    case "start session": {
      return {
        ...state,
        view: View.SESSION,
        complexCommandParams: {
          limit: action.limit,
          filter: action.filter,
          isLimitAppliedToCards: action.isLimitAppliedToCards,
          deckNames: action.deckNames,
          subject: action.subject,
        },
      };
    }
    case "show stats": {
      return {
        ...state,
        view: View.STATS,
        complexCommandParams: {
          limit: action.limit,
          filter: action.filter,
          isLimitAppliedToCards: action.isLimitAppliedToCards,
          deckNames: action.deckNames,
          subject: action.subject, // if deckNames is null then it is from past sessions
        },
      };
    }
    case "list": {
      return {
        ...state,
        view: View.LIST,
      };
    }
    case "post session": {
      return {
        ...state,
        view: View.POST_SESSION,
      };
    }
    case "quit to home": {
      return {
        ...state,
        view: View.DECK,
      };
    }
    case "view deck detail": {
      return {
        ...state,
        view: View.DECK_DETAIL,
        deckToViewDetail: action.deckName,
      };
    }
    case "load decks": {
      state.cardEditor.getDoc().setValue(action.createDSLValue);
      return state;
    }
    case "command not found": {
      return {
        ...state,
        view: View.ERROR,
      };
    }
    default:
      break;
  }
  debug("Unexpected end of reducer dispatch!");
  return state;
};

export default function App() {
  // Get initial data once from localStorage
  const { isFirstTimeUser, initialText, initialProgram } = getInitialData(); // TODO: Also find session information from localStorage

  const db = useDatabase();

  if (isFirstTimeUser) {
    createOrUpdateAllDecks(initialProgram, db);
  }

  const initialState: State = {
    view: View.DECK,
    program: initialProgram, // The "source of truth" until Goi gives user more card management

    cardEditor: undefined,
    deckToViewDetail: undefined,
    subjectToList: undefined,
    complexCommandParams: {
      limit: undefined,
      filter: undefined,
      isLimitAppliedToCards: undefined, // SUBJECT_MODIFIER::selectedCards boolean attribute
      deckNames: undefined,
      subject: Subject.Undefined, // if deckNames is null then it is from past sessions
    },
  };

  const [
    { view, program, deckToViewDetail, complexCommandParams },
    dispatch,
  ] = useReducer(reducer, initialState);

  const showView = (view: View) => {
    if (view !== View.SESSION && view !== View.POST_SESSION) {
      localStorage.removeItem("sessionData");
    }
    switch (view) {
      case View.DECK: {
        return <DeckView program={program} dispatch={dispatch}></DeckView>;
      }
      case View.POST_SESSION: {
        return <PostSessionSummary />;
      }
      case View.LIST: {
        return (
          <>
            <CustomListView
              program={program}
              dispatch={dispatch}
            ></CustomListView>
          </>
        );
      }
      case View.SESSION: {
        const sessionQueryError = checkSessionCommandError(
          program,
          complexCommandParams
        );
        if (sessionQueryError) {
          return (
            <ErrorMessage message={sessionQueryError.message}></ErrorMessage>
          );
        }
        const nowString = new Date().toString();
        const initialData = { created_at: nowString, session_id: nowString }; // redundant :/
        const initialDataString = JSON.stringify(initialData);
        localStorage.setItem("sessionData", initialDataString);

        // `from` contains all the parameters needed to select the cards
        // TODO
        let selectedCards = [];
        if (program.create_decks.length === 0) {
          return (
            <ErrorMessage message="You haven't created any deck!"></ErrorMessage>
          );
        }
        const selectedCreateDecks = program.create_decks.filter((cd) => {
          return complexCommandParams.deckNames?.includes(cd.name);
        });
        if (selectedCreateDecks.length === 0) {
          return (
            <ErrorMessage message="Please select one of the decks on the card editor"></ErrorMessage>
          );
        }
        for (const cd of selectedCreateDecks) {
          const deckName = cd.name;
          for (const card of cd.deck.cards) {
            const cardWithDeck = { ...card, deckName };
            selectedCards.push(cardWithDeck);
          }
        }
        selectedCards = randomizeCards(selectedCards);

        return (
          <Session
            deckNames={["French"]}
            dispatch={dispatch}
            cards={selectedCards}
          ></Session>
        );
      }
      case View.STATS: {
        return <Statistics></Statistics>;
      }
      case View.DECK_DETAIL: {
        console.log(deckToViewDetail);
        return (
          <DeckViewDetails
            name={deckToViewDetail}
            deck={
              program.create_decks.filter((d) => {
                return d.name === deckToViewDetail;
              })[0]
            }
          ></DeckViewDetails>
        );
      }
      case View.ERROR: {
        return (
          <ErrorMessage message="Command not found. Type 'Help'"></ErrorMessage>
        );
      }
      case View.LOADING: {
        return <CircularProgress style={{ margin: "auto" }} />;
      }
    }
  };

  return (
    <>
      <div className="navbar">
        <NavBar></NavBar>
      </div>
      <div className="container" style={{ backgroundColor: "#FAFAFA" }}>
        {/*gives CardEditor the ability to change Deck view */}
        <CardEditor
          dispatch={dispatch}
          program={program}
          initialText={initialText}
          isInSession={view === View.SESSION}
        ></CardEditor>
        <CommandEditor dispatch={dispatch}></CommandEditor>
        {showView(view)}
      </div>
    </>
  );
}
