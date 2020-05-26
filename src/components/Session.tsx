import React, { useState, useReducer } from "react";
import ProgressBar from "./ProgressBar";
import CardFlip from "./CardFlip";
import WrongBtn from "../assets/wrongBtn.svg";
import CorrectBtn from "../assets/correctBtn.svg";
import Timer from "react-compound-timer";
import PostSessionSummary from "./PostSessionSummary";
import { Action } from "../App";

function addCardDataToLocalStorage(
  card: any,
  nextCardIndex: number,
  gotCorrect: boolean
) {
  const sessionData = localStorage.getItem("sessionData");
  let cardDataArray;
  let sessionDataObject;
  let newSessionDataObject;
  if (sessionData) {
    sessionDataObject = JSON.parse(sessionData);
    cardDataArray = sessionDataObject["cardDataArray"];
    if (!cardDataArray) cardDataArray = [];
    const currentCardID = `${card.deckName}_${card.front}_${card.back}`;
    const cardData = {
      card_id: currentCardID,
      front: card.front,
      back: card.back,
      is_correct: gotCorrect,
      card_index: nextCardIndex,
    };
    const storedCardIDsAndResults = cardDataArray.map((c) => {
      return { id: c["card_id"], result: c["is_correct"] };
    });
    const alreadyAdded =
      storedCardIDsAndResults.filter(
        (o) => o.id === currentCardID && o.result !== undefined
      ).length > 0;
    if (!alreadyAdded) cardDataArray.push(cardData);
    newSessionDataObject = {
      ...sessionDataObject,
      cardDataArray: cardDataArray,
    };
    localStorage.setItem("sessionData", JSON.stringify(newSessionDataObject));
  }
}

function addEndTimeToSessionDataInLocalStorage() {
  const sessionData = localStorage.getItem("sessionData");
  let endedAt;
  let currentSessionData;
  if (sessionData) {
    currentSessionData = JSON.parse(sessionData);
    endedAt = currentSessionData["ended_at"];
  }
  if (currentSessionData && !endedAt) {
    const data = { ...currentSessionData, ended_at: new Date().toString() };
    const dataString = JSON.stringify(data);
    localStorage.setItem("sessionData", dataString);
  }
}

type Props = { cards; dispatch: React.Dispatch<Action> };

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
            {/* {props.deckNames.map((deckname) => {
                if (deckname === props.deckNames[props.deckNames.length - 1]) {
                  return <span>{deckname} </span>;
                }
                return <span>{deckname}, </span>;
              })
              } */}
          </p>
        </div>
        <ProgressBar
          cards={props.cards}
          dispatch={setIsDone}
          setNextCard={setNextCardIndex}
          addCardDataToLocalStorage={addCardDataToLocalStorage}
          currentCard={props.cards[nextCardIndex]}
        ></ProgressBar>
        <CardFlip
          front={props.cards[nextCardIndex].front}
          back={props.cards[nextCardIndex].back}
        ></CardFlip>
        <div style={{ textAlign: "center", marginTop: "3em" }}>
          <input
            alt="correct"
            type="image"
            src={CorrectBtn}
            style={{ width: "3em", marginRight: "4em" }}
            onClick={() => {
              setResult("Correct!");
              addCardDataToLocalStorage(
                { ...props.cards[nextCardIndex], nextCardIndex },
                nextCardIndex,
                true
              );
              // TODO
              // props.dispatch({
              //   type: CardCorrect, card: {
              //   }
              // });
            }}
          />
          <input
            alt="wrong"
            type="image"
            src={WrongBtn}
            style={{ width: "3em" }}
            onClick={() => {
              setResult("Try again!");
              console.log(result);
              addCardDataToLocalStorage(
                { ...props.cards[nextCardIndex], nextCardIndex },
                nextCardIndex,
                false
              );
            }}
          />
        </div>
        <h2>{result}</h2>
      </div>
    </>
  );
}
