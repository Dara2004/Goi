import React from "react";
import { Paper } from "@material-ui/core";

function Deck({ name }: { name: string }) {
  return (
    <Paper
      style={{
        margin: "2em",
        width: "20vw",
        height: "12vw",
        justifyItems: "center",
        display: "flex",
      }}
    >
      <div style={{ margin: "auto" }}>{name}</div>
    </Paper>
  );
}

export default function ListView({ deckNames }: { deckNames: string[] }) {
  return (
    <div
      style={{
        marginTop: "2em",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      {deckNames.map((deckName) => (
        <Deck name={deckName}></Deck>
      ))}
    </div>
  );
}
