import React, { useState, useReducer, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import CardFlip from "./CardFlip";
import WrongBtn from "../assets/wrongBtn.svg";
import CorrectBtn from "../assets/correctBtn.svg";
import Timer from "react-compound-timer";
import PostSessionSummary from "./PostSessionSummary";
import { Action, ActionType, ComplexCommandParams, Subject } from "../App";
import {
  FlashCard,
  checkSessionCommandError,
  getSessionMaterials,
} from "../lib/sessionHelperFunctions";
import PROGRAM from "../ast/PROGRAM";
import { CircularProgress } from "@material-ui/core";
import ErrorMessage from "./ErrorMessage";
import { useDatabase } from "@nozbe/watermelondb/hooks";

type Props = {
  complexCommandParams: ComplexCommandParams;
  program: PROGRAM;
  dispatch: React.Dispatch<Action>;
};

/**
 * A list of cards, and optionally, a list of deck names
 */
export type SessionMaterials = {
  deckNames?: string[];
  cards: FlashCard[];
};

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
      deck: card.deckName,
    };
    const alreadyAdded = cardDataArray.filter(
      (o) => o.card_id === currentCardID
    )[0];
    const alreadyAddedIndex = cardDataArray.indexOf(alreadyAdded);
    if (alreadyAdded) {
      cardDataArray[alreadyAddedIndex] = cardData;
    } else {
      cardDataArray.push(cardData);
    }
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

const dummySessionMaterials: SessionMaterials = {
  deckNames: ["d1, d2"],
  cards: [
    {
      front: "f1",
      back: "b1",
      deckName: "d1",
    },
    {
      front: "f2",
      back: "b2",
      deckName: "d1",
    },
    {
      front: "f3",
      back: "b3",
      deckName: "d2",
    },
  ],
};

// const getSessionMaterials = async (
//   program,
//   subject,
//   filter,
//   limit,
//   isLimitAppliedToCards,
//   deckNames
// ): Promise<SessionMaterials> => {
//   return dummySessionMaterials;
// };

export default function Session(props: Props) {
  const db = useDatabase();
  const [result, setResult] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [nextCardIndex, setNextCardIndex] = useState(0);
  const [sessionMaterials, setSessionMaterials] = useState<SessionMaterials>(
    dummySessionMaterials
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>(null);

  useEffect(() => {
    const sessionCommandErr = checkSessionCommandError(
      props.program,
      props.complexCommandParams
    );
    if (sessionCommandErr) {
      setError(new Error(sessionCommandErr.message));
      return;
    }

    const _getSessionMaterials = async () => {
      try {
        const sessionMaterials = await getSessionMaterials(
          props.program,
          props.complexCommandParams,
          db
        );
        console.log(sessionMaterials);
        // const sessionMaterials = dummySessionMaterials;
        setSessionMaterials(sessionMaterials);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.log(err);
        setError(err);
        setIsLoading(false);
      }
    };

    _getSessionMaterials();
  }, []);

  // const nowString = new Date().toString();
  // const initialData = { created_at: nowString, session_id: nowString }; // redundant :/
  // const initialDataString = JSON.stringify(initialData);
  // localStorage.setItem("sessionData", initialDataString);

  // // `from` contains all the parameters needed to select the cards
  // // TODO
  // let selectedCards = [];
  // if (program.create_decks.length === 0) {
  //   return (
  //     <ErrorMessage message="You haven't created any deck!"></ErrorMessage>
  //   );
  // }
  // const selectedCreateDecks = program.create_decks.filter((cd) => {
  //   return complexCommandParams.deckNames?.includes(cd.name);
  // });
  // if (selectedCreateDecks.length === 0) {
  //   return (
  //     <ErrorMessage message="Please select one of the decks on the card editor"></ErrorMessage>
  //   );
  // }
  // for (const cd of selectedCreateDecks) {
  //   const deckName = cd.name;
  //   for (const card of cd.deck.cards) {
  //     const cardWithDeck = { ...card, deckName };
  //     selectedCards.push(cardWithDeck);
  //   }
  // }
  // selectedCards = randomizeCards(selectedCards);

  const showDecksOrPastSessionsHeader = () => {
    if (props.complexCommandParams.subject === Subject.Decks) {
      return (
        <>
          <h3 className="decks">DECKS: </h3>
          <br></br>
          <p className="deckNames">
            {sessionMaterials.deckNames.map((deckname) => {
              if (
                deckname ===
                sessionMaterials.deckNames[
                  sessionMaterials.deckNames.length - 1
                ]
              ) {
                return <span>{deckname} </span>;
              }
              return <span>{deckname}, </span>;
            })}
          </p>
        </>
      );
    } else if (props.complexCommandParams.subject === Subject.Sessions) {
      let numPastSessionsString = props.complexCommandParams.limit?.toString();
      if (!numPastSessionsString) {
        numPastSessionsString = "5"; // TODO use a global constant for default number
      }
      return (
        <>
          <h3 className="decks">Past Sessions</h3>
          <br></br>
          <p className="deckNames">{numPastSessionsString}</p>
        </>
      );
    }
  };

  if (error) {
    return <ErrorMessage message={error.message}></ErrorMessage>;
  }

  if (isDone) {
    addEndTimeToSessionDataInLocalStorage();
    props.dispatch({ type: ActionType.PostSession });
  }
  if (!isLoading) {
    return (
      <>
        {!isDone && (
          <div className="session-container">
            <h1>Session</h1>

            <div className="session-duration">
              <h3 className="duration">DURATION: </h3>
              <br></br>
              <Timer initialTime={1000}>
                {() => (
                  <React.Fragment>
                    <div className="timer">
                      <Timer.Minutes /> mins <Timer.Seconds /> secs
                    </div>
                  </React.Fragment>
                )}
              </Timer>
              {showDecksOrPastSessionsHeader()}
            </div>
            <ProgressBar
              cards={sessionMaterials.cards}
              dispatch={setIsDone}
              setNextCard={setNextCardIndex}
              addCardDataToLocalStorage={addCardDataToLocalStorage}
              currentCard={sessionMaterials.cards[nextCardIndex]}
              currentResult={result}
              setResult={setResult}
            ></ProgressBar>
            <CardFlip
              front={sessionMaterials.cards[nextCardIndex].front}
              back={sessionMaterials.cards[nextCardIndex].back}
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
                    { ...sessionMaterials.cards[nextCardIndex], nextCardIndex },
                    nextCardIndex,
                    true
                  );
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
                    { ...sessionMaterials.cards[nextCardIndex], nextCardIndex },
                    nextCardIndex,
                    false
                  );
                }}
              />
            </div>
            <h2>{result}</h2>
          </div>
        )}
      </>
    );
  } else {
    return <CircularProgress></CircularProgress>;
  }
}
