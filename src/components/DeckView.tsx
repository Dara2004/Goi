import React from "react";
import NewCard from "./NewCard";

// import React from 'react';
import CenteredTabs from "./CenteredTabs";
import { Paper } from "@material-ui/core";
import ListView from "./ListView";
import PROGRAM from "../ast/PROGRAM";
import DECK from "../ast/DECK";

export default function DeckView({
  program,
  dispatch,
}: {
  program: PROGRAM;
  dispatch: Function;
}) {
  const decks: DECK[] = program?.create_decks?.map((cd) => cd.deck);
  if (!decks || decks.length === 0) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>You have no deck! 🙀 Enter something in the editor!</h2>
      </div>
    );
  }
  const lastDeck = decks[decks.length - 1];
  const { front, back } = lastDeck.cards[lastDeck.cards.length - 1];

  return (
    <>
      <div className="card-view-container">
        <div className="card-view">
          <h1 style={{ color: "#333333" }}>
            Deck: {program.create_decks[program.create_decks.length - 1].name}
          </h1>
          <NewCard front={front} back={back}></NewCard>
          <div
            style={{
              marginTop: "2em",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <ListView
              deckNames={program.create_decks.map((cd) => cd.name)}
              dispatch={dispatch}
            ></ListView>
          </div>
        </div>
      </div>
    </>
  );
}
