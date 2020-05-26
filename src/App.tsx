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
import DeckViewDetails from "./components/DeckViewDetails";
import ErrorMessage from "./components/ErrorMessage";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import {
  getSelectedDecks,
  deckFilter,
  Filter,
  getCardsFromSelectedDecks,
} from "./model/query";

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
export const cardEditorStrKey = "cardEditorStrKey";
const updateViewReducer = (state, action) => {
  switch (action.type) {
    case "card editor parse success": {
      return {
        ...state,
        program: { ...action.program },
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
    case "post session": {
      return {
        ...state,
        view: View.POST_SESSION,
      };
    }
    case "view deck detail": {
      console.log(action.deckName);
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
      return {
        ...state,
        createDSLValue: action.createDSLValue,
      };
    }
    case "command": {
      return {
        ...state,
        view: View.ERROR,
      };
    }
    default:
      break;
  }
  return state;
};

export enum View {
  DECK,
  STATS,
  SESSION,
  POST_SESSION,
  LIST,
  DECK_DETAIL,
  ERROR,
}

const initialProgram = {
  create_decks: [
    {
      name: "Practice Final",
      deck: {
        cards: [
          { front: "Foo", back: "Bar" },
          { front: "Evan", back: "You" },
        ],
      },
    },
  ],
};

const initialState = {
  view: View.DECK,
  program:
    JSON.parse(localStorage.getItem("programAST")) ||
    (initialProgram as PROGRAM),
  deckToViewDetail: "",
  from: {
    limit: 0,
    filter: "",
    selectedCards: false, // determines whether limit applies to cards or SUBJECT (decks/sessions)
    deckNames: [], // if deckNames is null then it is from past sessions
  },
};

export default function App() {
  const database = useDatabase();

  // const decks = ["deck1", "deck2", "deck3", "deck4", "deck5", "deck6"];
  // getSelectedDecks(database, decks).then((decks) => {
  //   const worst5Decks = deckFilter(decks, Filter.WORST, 5);
  //   getCardsFromSelectedDecks(
  //     database,
  //     worst5Decks.map((d) => d.name)
  //   ).then((cards) => {});
  // });

  const [
    { view, program, deckToViewDetail, createDSLValue, from },
    dispatch,
  ] = useReducer(updateViewReducer, initialState);

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
          return from.deckNames?.includes(cd.name);
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
        return (
          <Session
            deckNames={from.deckNames}
            cards={selectedCards}
            dispatch={dispatch}
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
          createDSLValue={createDSLValue}
          isInSession={view === View.SESSION}
        ></CardEditor>{" "}
        <CommandEditor dispatch={dispatch}></CommandEditor>
        {showView(view)}
      </div>
    </>
  );
}
