import React from "react";
import ProgressBar from "./ProgressBar";
import CardFlip from "./CardFlip";
import WrongBtn from "../assets/wrongBtn.svg";
import CorrectBtn from "../assets/correctBtn.svg";

export default function DeckViewDetails(props) {
  return (
    <>
      <div className="session-container" style={{ textAlign: "center" }}>
        <h1>Deck: {props.name}</h1>
        {props.deck.deck.cards.map((c) => {
          return <CardFlip front={c.front} back={c.back}></CardFlip>;
        })}
      </div>
    </>
  );
}
