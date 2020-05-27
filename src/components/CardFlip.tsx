import ReactCardFlip from "react-card-flip";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import SingleCard from "./SingleCard";

const useStyles = makeStyles({
  root: {
    marginTop: "1em",
    textAlign: "center",
    margin: "0 auto",
    // paddingTop: "3.5em",
  },
});

type Props = {
  front: string;
  back: string;
  attributes?: Array<{ attributeType: string; value: string }>;
};

export default function CardFlip(props: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const classes = useStyles();
  const { front, back, attributes } = props;
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
            <SingleCard content={front} attributes={attributes}></SingleCard>
          </div>

          <div onClick={handleClick}>
            <SingleCard
              content={back}
              onClick={handleClick}
              attributes={attributes}
            ></SingleCard>
          </div>
        </ReactCardFlip>
      </div>
    </>
  );
}
