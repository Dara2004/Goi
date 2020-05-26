import React from "react";
import { Paper } from "@material-ui/core";
import CenteredTabs from "./CenteredTabs";

type DeckProps = { name: string; dispatch?; key: number };
type ListProps = { deckNames: string[]; dispatch? };

function Deck(props: DeckProps) {
  return (
    <Paper
      style={{
        margin: "2em",
        width: "20vw",
        height: "12vw",
        justifyItems: "center",
        display: "flex",
        fontSize: "1.5em",
      }}
      onClick={() => {
        console.log(props.name);
        props.dispatch({ type: "view deck detail", deckName: props.name });
      }}
    >
      <div style={{ margin: "auto" }}>{props.name}</div>
    </Paper>
  );
}

export default function ListView(props: ListProps) {
  return (
    <>
      {props.deckNames.map((deckName, idx) => (
        <Deck key={idx} name={deckName} dispatch={props.dispatch}></Deck>
      ))}
    </>
  );
}
