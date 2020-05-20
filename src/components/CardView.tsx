import React from "react";
import NewCard from "./NewCard";

// import React from 'react';
import CenteredTabs from "./CenteredTabs";
import { Paper } from "@material-ui/core";

export default function CardView({ cards }) {
  const { front, back } = cards[0];
  return (
    <>
      <div className="card-view-container">
        <div className="card-view">
          <div style={{ width: "50%", textAlign: "center" }}>
            <CenteredTabs></CenteredTabs>
          </div>
          <NewCard front={front} back={back}></NewCard>
          <div className="deck-grid">
            <Paper />
          </div>
        </div>
      </div>
    </>
  );
}
