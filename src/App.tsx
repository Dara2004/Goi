import React, { useRef, useEffect, useState, useReducer } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import CardView from "./components/CardView";
import { UnControlled as CodeMirror } from "react-codemirror2";
import CardEditor from "./components/CardEditor";
import CommandEditor from "./components/CommandEditor";
import Session from "./components/Session";
import Statistics from "./components/Statistics";

const updateViewReducer = (state, action) => {
  switch (action.type) {
    case "create cards": {
      return {
        ...state,
        cards: [{ front: action.value, back: action.value }],
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
const initialState = {
  cards: [{ front: "Example", back: "Exemple" }],
  command: "",
};
export default function App() {
  const [{ cards, command }, dispatch] = useReducer(
    updateViewReducer,
    initialState
  );

  const handleCardsChange = (value) => {
    //use actual front and back in AST to set cards
    dispatch({ type: "create cards", value: value });
  };

  const handleCommandChange = (value) => {
    dispatch({ type: "command", value: value });
  };

  return (
    <>
      <div className="navbar">
        <NavBar></NavBar>
      </div>
      <div className="container">
        <CardEditor onChange={handleCardsChange}></CardEditor>
        <CommandEditor onChange={handleCommandChange}></CommandEditor>
        {command === ">Start session" ? (
          <Session></Session>
        ) : command === ">Show" ? (
          <Statistics></Statistics>
        ) : (
          <CardView cards={cards}></CardView>
        )}
      </div>
    </>
  );
}
