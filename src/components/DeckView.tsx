import React from "react";
import NewCard from "./NewCard";

// import React from 'react';
import CenteredTabs from "./CenteredTabs";
import { Paper } from "@material-ui/core";
import ListView from "./ListView";

export default function CardView({ cards }) {
  const deckNames = ["Japanese", "Chinese", "French", "Spanish"];

  const { front, back } = cards[0];
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
          <ListView deckNames={deckNames}></ListView>
        </div>
      </div>
    </>
  );
}
