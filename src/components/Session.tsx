import React, { useState, useReducer } from "react";
import ProgressBar from "./ProgressBar";
import CardFlip from "./CardFlip";
import WrongBtn from "../assets/wrongBtn.svg";
import CorrectBtn from "../assets/correctBtn.svg";
import Timer from "react-compound-timer";
import PostSessionSummary from "./PostSessionSummary";

type Props = { deckNames; cards };
export default function Session(props: Props) {
  const [result, setResult] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [nextCardIndex, setNextCardIndex] = useState(0);

  return isDone ? (
    <PostSessionSummary></PostSessionSummary>
  ) : (
    <>
      <div className="session-container">
        <h1>Session</h1>

        <div className="session-duration">
          <h3 className="duration">DURATION: </h3>
          <br></br>
          <Timer initialTime={1000}>
            {({ start, resume, pause, stop, reset, timerState }) => (
              <React.Fragment>
                <div className="timer">
                  <Timer.Minutes /> mins <Timer.Seconds /> secs
                </div>
              </React.Fragment>
            )}
          </Timer>

          <h3 className="decks">DECKS: </h3>
          <br></br>
          <p className="deckNames">
            {props.deckNames.map((deckname) => {
              if (deckname === props.deckNames[props.deckNames.length - 1]) {
                return <span>{deckname} </span>;
              }
              return <span>{deckname}, </span>;
            })}
          </p>
        </div>
        <ProgressBar
          cards={props.cards}
          dispatch={setIsDone}
          setNextCard={setNextCardIndex}
        ></ProgressBar>
        <CardFlip
          front={props.cards[nextCardIndex].front}
          back={props.cards[nextCardIndex].back}
        ></CardFlip>
        <div style={{ textAlign: "center", marginTop: "3em" }}>
          <img
            src={CorrectBtn}
            style={{ width: "3em", marginRight: "4em" }}
            onClick={() => {
              setResult("Correct!");
            }}
          />
          <img
            src={WrongBtn}
            style={{ width: "3em" }}
            onClick={() => {
              setResult("Try again!");
              console.log(result);
            }}
          />
        </div>
        <h2>{result}</h2>
      </div>
    </>
  );
}
