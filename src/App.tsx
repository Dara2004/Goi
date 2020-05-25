import React, { useRef, useEffect, useState, useReducer } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import DeckView from "./components/DeckView";
import { UnControlled as CodeMirror } from "react-codemirror2";
import CardEditor from "./components/CardEditor";
import CommandEditor from "./components/CommandEditor";
import Session from "./components/Session";
import Statistics from "./components/Statistics";
import Deck from "./model/Deck";
import PostSessionSummary from "./components/PostSessionSummary";
import ListView from "./components/ListView";
import PROGRAM from "./ast/PROGRAM";
import { getInitialData } from "./lib/getIintialData";
import { createOrUpdateAllDecks } from "./lib/reconciler";

import DeckViewDetails from "./components/DeckViewDetails";
import ErrorMessage from "./components/ErrorMessage";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import {
  getSelectedDecks,
  deckFilter,
  Filter,
  getCardsFromSelectedDecks,
} from "./model/query";
import { debug } from "./lib/utils";

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
}

// Get initial data once from localStorage
const { isFirstTimeUser, initialText, initialProgram } = getInitialData();

const initialState = {
  view: View.DECK,
  program: initialProgram, // The "source of truth" until Goi gives user more card management
  cardEditor: undefined,
  intialText: initialText,
  deckToViewDetail: undefined,
  from: {
    limit: undefined,
    filter: undefined,
    selectedCards: undefined, // determines whether limit applies to cards or SUBJECT (decks/sessions)
    deckNames: undefined, // if deckNames is null then it is from past sessions
  },
};

type State = typeof initialState;

enum ActionType {
  SetCardEditor = "set card editor",
  CardEditorParseSuccess = "card editor parse success",
  StartSession = "start session",
  List = "list",
  ViewDeckDetail = "view deck detail",
  ShowStats = "show stats",
  LoadDecks = "load decks",
}

export enum Subject {
  Decks = "decks",
  Sessions = "sessions",
  Tags = "tags", // not supported yet
}

type Action =
  | {
      type: ActionType.SetCardEditor;
      cardEditor: CodeMirror.Editor;
    }
  | {
      type: ActionType.CardEditorParseSuccess;
      program: PROGRAM;
    }
  | {
      type: ActionType.StartSession;
      limit: number;
      filter?: string;
      selectedCards?: boolean;
      deckNames?: string[];
      subject: Subject;
    }
  | {
      type: ActionType.List;
      deckNames?: string[]; // Tags not implemented
    }
  | {
      type: ActionType.ViewDeckDetail;
      deckName: string;
    }
  | {
      type: ActionType.ShowStats;
      limit: number;
      filter?;
      selectedCards?;
      deckNames?: string[];
      subject: Subject;
    }
  | {
      type: ActionType.LoadDecks;
      createDSLValue: string;
      // TODO
    };

const reducer = (state: State, action: Action): State => {
  debug("Dispatched to App: ", action);
  switch (action.type) {
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
        from: {
          limit: action.limit,
          filter: action.filter,
          selectedCards: action.selectedCards, // determines whether limit applies to cards or SUBJECT (decks/sessions)
          deckNames: action.deckNames, // if deckNames is null then it is from past sessions
        },
      };
    }
    case "list": {
      return {
        ...state,
        view: View.LIST,
      };
    }
    case "view deck detail": {
      return {
        ...state,
        view: View.DECK_DETAIL,
        deckToViewDetail: action.deckName,
      };
    }
    case "show stats": {
      return {
        ...state,
        view: View.STATS,
        from: {
          limit: action.limit,
          filter: action.filter,
          selectedCards: action.selectedCards, // determines whether limit applies to cards or SUBJECT (decks/sessions)
          deckNames: action.deckNames, // if deckNames is null then it is from past sessions
        },
      };
    }
    case "load decks": {
      state.cardEditor.getDoc().setValue(action.createDSLValue);
      return state;
    }
    default:
      break;
  }
  debug("Unexpected end of reducer dispatch!");
  return state;
};

export default function App() {
  const db = useDatabase();

  if (isFirstTimeUser) {
    createOrUpdateAllDecks(initialProgram, db);
  }

  const [{ view, program, deckToViewDetail, from }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const showView = (view: View) => {
    switch (view) {
      case View.DECK: {
        return <DeckView program={program} dispatch={dispatch}></DeckView>;
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
        // `from` contains all the parameters needed to select the cards
        let selectedCards = [];
        if (program.create_decks.length === 0) {
          return (
            <ErrorMessage message="You haven't created any deck!"></ErrorMessage>
          );
        }
        if (from.deckNames) {
        }
        const selectedCreateDecks = program.create_decks.filter((cd) => {
          return from.deckNames?.includes(cd.name);
        });
        if (selectedCreateDecks.length === 0) {
          return (
            <ErrorMessage message="Please select one of the decks on the card editor"></ErrorMessage>
          );
        }
        for (const cd of selectedCreateDecks) {
          for (const card of cd.deck.cards) {
            selectedCards.push(card);
          }
        }
        return (
          <Session deckNames={from.deckNames} cards={selectedCards}></Session>
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
        ></CardEditor>
        <CommandEditor dispatch={dispatch}></CommandEditor>
        {showView(view)}
      </div>
    </>
  );
}
