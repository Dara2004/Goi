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

const updateViewReducer = (state, action) => {
  switch (action.type) {
    case "card editor parse success": {
      console.log("received action: parse success");
      return {
        ...state,
        program: { ...action.program },
        view: View.DECK,
      };
    }
    case "command": {
      return {
        ...state,
        command: action.value,
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
  program: initialProgram as PROGRAM,
  command: "",
};

export default function App() {
  const [{ view, program, command }, dispatch] = useReducer(
    updateViewReducer,
    initialState
  );

  const handleCommandChange = (value) => {
    dispatch({ type: "command", value: value });
  };

  const showView = (view: View) => {
    switch (view) {
      case View.DECK: {
        return <DeckView program={program}></DeckView>;
      }
      // case View.LIST: {
      //   return <ListView></ListView>;
      // }
      case View.SESSION: {
        return <Session></Session>;
      }
      case View.STATS: {
        return <Statistics></Statistics>;
      }
      case View.POST_SESSION: {
        return <PostSessionSummary></PostSessionSummary>;
      }
    }
  };

  return (
    <>
      <div className="navbar">
        <NavBar></NavBar>
      </div>
      <div className="container" style={{ backgroundColor: "#FAFAFA" }}>
        <CardEditor dispatch={dispatch}></CardEditor>
        <CommandEditor onChange={handleCommandChange}></CommandEditor>
        {showView(view)}
      </div>
    </>
  );
}
