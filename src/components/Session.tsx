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
import { Database, Collection } from "@nozbe/watermelondb";
import { TableName } from "../model/constants";
import SessionModel from "../model/Session";
import CardModel from "../model/Card";
import DeckModel from "../model/Deck";
import { Q } from "@nozbe/watermelondb";

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

type SessionDataType = {
  created_at: string;
  sessionId: string;
  cardDataArray: LocalCardFromSession[];
  ended_at: string;
};

type LocalCardFromSession = {
  card_id: string;
  deck: string;
  front: string;
  back: string;
  is_correct?: boolean;
};
async function saveSessionDataToDB(
  data: SessionDataType,
  db: Database
): Promise<void> {
  const sessionsTable: Collection<SessionModel> = db.collections.get(
    TableName.SESSIONS
  );

  const cardsTable: Collection<CardModel> = db.collections.get(TableName.CARDS);
  const decksTable: Collection<DeckModel> = db.collections.get(TableName.DECKS);

  //any db modification needs to be wrapped in action
  await db.action(async () => {
    //get cards in session from db
    const deckNameToDeckModel = {}; // deck name -> deck Model
    const createdSession = await sessionsTable.create((session) => {
      session.started_at = new Date(data.created_at);
      session.ended_at = new Date(data.ended_at);
    });
    for (const c of data.cardDataArray) {
      if (!deckNameToDeckModel[c.deck]) {
        deckNameToDeckModel[c.deck] = (
          await decksTable.query(Q.where("deck_name", Q.eq(c.deck))).fetch()
        )[0];
      }
      const deckId = deckNameToDeckModel[c.deck].id;
      const matchedCards = await cardsTable
        .query(
          Q.where("deck_id", Q.eq(deckId)),
          Q.where("front", Q.eq(c.front)),
          Q.where("back", Q.eq(c.back))
        )
        .fetch();
      let cardModel: CardModel;
      if (matchedCards.length === 0) {
        //if cards were not saved properly, just in case, save it to cards
        const deckModel: DeckModel = deckNameToDeckModel[c.deck];
        //use subaction to run an action inside an action
        await deckModel.subAction(async () => {
          cardModel = (await deckModel.addCard(c.front, c.back)) as CardModel;
        });
      } else {
        cardModel = matchedCards[0];
      }
      if (c.is_correct === true || c.is_correct === false) {
        //not skipped
        await cardModel.update((cm) => {
          if (c.is_correct) {
            cm.right++;
          } else {
            cm.wrong++;
          }
          cm.last_tested_at = new Date(data.ended_at);
        });
      }
    }
  });
}

function addEndTimeToSessionDataInLocalStorage(db: Database) {
  const sessionData = localStorage.getItem("sessionData");
  let endedAt;
  let currentSessionData;
  if (sessionData) {
    currentSessionData = JSON.parse(sessionData);
    endedAt = currentSessionData["ended_at"];
  }
  if (currentSessionData && !endedAt) {
    const data = { ...currentSessionData, ended_at: new Date().toString() };
    saveSessionDataToDB(data, db);
    const dataString = JSON.stringify(data);
    localStorage.setItem("sessionData", dataString);
  }
}

export default function Session(props: Props) {
  const db = useDatabase();
  const [result, setResult] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [nextCardIndex, setNextCardIndex] = useState(0);
  const [sessionMaterials, setSessionMaterials] = useState<SessionMaterials>(
    null
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
        const nowString = new Date().toString();
        const initialData = { created_at: nowString, session_id: nowString }; // redundant :/
        const initialDataString = JSON.stringify(initialData);
        localStorage.setItem("sessionData", initialDataString);

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

  useEffect(() => {
    if (isDone) {
      addEndTimeToSessionDataInLocalStorage(db);
      props.dispatch({ type: ActionType.PostSession });
    }
  }, [isDone]);

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
                return <span key={deckname}>{deckname} </span>;
              }
              return <span key={deckname}>{deckname}, </span>;
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
    return <CircularProgress></CircularProgress>;
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
