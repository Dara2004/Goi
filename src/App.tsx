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
  console.log("hi");
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
  // const [cards, setCards] = useState([{ front: "Example", back: "Exemple" }]);
  const [state, dispatch] = useReducer(updateViewReducer, initialState);
  const { cards, command } = state;

  const handleCardsChange = (value) => {
    console.log("value =", value);
    // setCards([{ front: value, back: value }]); //use actual front and back in AST to set cards
    dispatch({ type: "create cards", value: value });
  };

  const handleCommandChange = (value) => {
    console.log(value);
    dispatch({ type: "command", value: value });
  };

  return (
    <>
      <div className="navbar">
        <NavBar></NavBar>
      </div>
      <div className="container">
        {/* card editor causes cardview to change-> setcards */}
        <CardEditor onChange={handleCardsChange}></CardEditor>
        <CommandEditor onChange={handleCommandChange}></CommandEditor>
        <CardView cards={state.cards}></CardView>
        {command === "Start Session" ? (
          <Session></Session>
        ) : command === "Show" ? (
          <Statistics></Statistics>
        ) : (
          <></>
        )}
      </div>
      <Session></Session>
    </>
  );
}
