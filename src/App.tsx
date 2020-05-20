import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import CardView from "./components/CardView";
import { UnControlled as CodeMirror } from "react-codemirror2";
import CardEditor from "./components/CardEditor";
import CommandEditor from "./components/CommandEditor";
import Session from "./components/Session";
// import Session from './components/Session';
// import Statistics from './components/Statistics';

export default function App() {
  const [cards, setCards] = useState([{ front: "Example", back: "Exemple" }]);
  const handleChange = (value: string) => {
    setCards([{ front: value, back: value }]); //use actual front and back in AST to set cards
  };
  return (
    <>
      <div className="navbar">
        <NavBar></NavBar>
      </div>
      <div className="container">
        {/* card editor causes cardview to change-> setcards */}
        <CardEditor onChange={handleChange}></CardEditor>
        <CommandEditor></CommandEditor>
        <CardView cards={cards}></CardView>
      </div>
      <Session></Session>
    </>
  );
}
