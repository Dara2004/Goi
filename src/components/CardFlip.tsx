import ReactCardFlip from "react-card-flip";
import React, { useState } from "react";
import { Paper, makeStyles } from "@material-ui/core";
import SingleCard from "./SingleCard";
import { AutoComplete } from "material-ui";

const useStyles = makeStyles({
  root: {
    marginTop: "1em",
    textAlign: "center",
    margin: "0 auto",
  },
});

export default function CardFlip() {
  const [isFlipped, setIsFlipped] = useState(false);
  const classes = useStyles();
  const handleClick = (e) => {
    e.preventDefault();
    setIsFlipped((curState) => {
      return !curState;
    });
  };

  return (
    <>
      <div className={classes.root}>
        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
          <div onClick={handleClick}>
            <SingleCard content="Front"></SingleCard>
          </div>

          <div onClick={handleClick}>
            <SingleCard content="Back" onClick={handleClick}></SingleCard>
          </div>
        </ReactCardFlip>
      </div>
    </>
  );
}
