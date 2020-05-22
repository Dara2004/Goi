import React from "react";
import NewCard from "./NewCard";

// import React from 'react';
import CenteredTabs from "./CenteredTabs";
import { Paper } from "@material-ui/core";
import ListView from "./ListView";
import PROGRAM from "../ast/PROGRAM";
import DECK from "../ast/DECK";

export default function DeckView({ program }: { program: PROGRAM }) {
  const decks: DECK[] = program?.create_decks?.map((cd) => cd.deck);
  if (!decks || decks.length === 0) {
    return <h1>No decks lol</h1>;
  }
  const lastDeck = decks[decks.length - 1];
  if (!lastDeck) {
    return <h1>Last deck is null but apparently we have a deck??</h1>;
  }
  const { front, back } = lastDeck.cards[lastDeck.cards.length - 1];

  return (
    <>
      <div className="card-view-container">
        <div className="card-view">
          <div
            style={{
              width: "70%",
              textAlign: "center",
              marginTop: "3em",
              borderBottom: "1px solid #DDDDDD",
            }}
          >
            <CenteredTabs></CenteredTabs>
          </div>
          <NewCard front={front} back={back}></NewCard>
          <ListView
            deckNames={program.create_decks.map((cd) => cd.name)}
          ></ListView>
        </div>
      </div>
    </>
  );
}
