import React, { useState, useEffect } from "react";
import StatisticsTable from "./StatisticsTable";
import StatisticsOverview from "./StatisticsOverview";
import { ColumnType } from "./StatisticsTable";
import {
  createCardData,
  createDeckData,
  createSessionData,
} from "../lib/utils";
import { Subject, ComplexCommandParams } from "../App";
import {
  getSelectedDecks,
  getCardsFromSelectedDecks,
  cardFilter,
  getCardsFromSelectedSessions,
  deckFilter,
  getDeckNameFromID,
  calculateDeckScore,
  getPastSessions,
  sessionFilter,
  getUniqueDeckNamesFromSessions,
} from "../model/query";
import { Database } from "@nozbe/watermelondb";
import { CircularProgress } from "@material-ui/core";
import Card from "../model/Card";
import Deck from "../model/Deck";
import Session from "../model/Session";
import SessionCard from "../model/SessionCard";

type Props = { complexCommandParams: ComplexCommandParams; database: Database };

function getStatsObject() {
  // temp return object for testing:
  return {
    overview: {
      "average score": "5",
      "highest score": "10",
      "lowest score": "10",
    },
    details: [
      createCardData(1, "Bonjour", "Hello", 1, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 11, 10, "French"),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French"),
    ],
    columnType: ColumnType.CARD_COLUMNS,
  };
}

enum View {
  LOADING,
  READY,
  ERROR,
}

type StatsObject = any; // can add typing here

type StatsState =
  | {
      view: View.LOADING;
    }
  | {
      view: View.READY;
      statsObject: StatsObject;
    }
  | {
      view: View.ERROR;
      error: Error;
    };

export default function Statistics(props: Props) {
  // Initialize the view to be "Loading" since we need to do asynchronous operation before showing data
  const initialState: StatsState = { view: View.LOADING };
  const [state, setState] = useState<StatsState>(initialState);

  const {
    limit,
    filter,
    isLimitAppliedToCards,
    deckNames,
    subject,
  } = props.complexCommandParams;

  async function createStatsObject() {
    const {
      rows,
      highestScore,
      lowestScore,
      averageScore,
    } = await getDetails();
    return {
      overview: {
        "average score": averageScore,
        "highest score": highestScore,
        "lowest score": lowestScore,
      },
      details: rows,
      columnType: getColumnType(),
    };
  }

  async function getDetails() {
    let rows = [];
    let highestScore: number = NaN;
    let lowestScore: number = NaN;
    let averageScore: number = NaN;
    let index = 1;
    if (isLimitAppliedToCards) {
      let retrievedCards: Array<Card>;
      if (subject === Subject.Decks) {
        retrievedCards = await getCardsFromSelectedDecks(
          props.database,
          deckNames
        );
      } else if (subject === Subject.Sessions) {
        retrievedCards = await getCardsFromSelectedSessions(
          props.database,
          limit
        );
      } else {
        throw new Error(
          `Retrieving stats for cards from ${subject} is not supported`
        );
      }
      const filteredCards = cardFilter(retrievedCards, filter, limit);
      for (let card of filteredCards) {
        const score: number = card.right / (card.wrong + card.right);
        highestScore =
          isNaN(highestScore) || score > highestScore ? score : highestScore;
        lowestScore =
          isNaN(lowestScore) || score < lowestScore ? score : lowestScore;
        rows = rows.concat(
          createCardData(
            index,
            card.front,
            card.back,
            card.right,
            card.wrong,
            await getDeckNameFromID(props.database, card.deck_id)
          )
        );
        index += 1;
      }
    } else if (subject === Subject.Decks) {
      const retrievedDecks = await getSelectedDecks(props.database, deckNames);
      let filteredDecks: Array<Deck> = await deckFilter(
        retrievedDecks,
        filter,
        limit
      );
      for (let deck of filteredDecks) {
        const cards = await deck.cards.fetch();
        const score = calculateDeckScore(cards);
        rows = rows.concat(
          createDeckData(index, deck.name, cards.length, score)
        );
        highestScore =
          isNaN(highestScore) || score > highestScore ? score : highestScore;
        lowestScore =
          isNaN(lowestScore) || score < lowestScore ? score : lowestScore;
        index += 1;
      }
    } else if (subject === Subject.Sessions) {
      let decks = new Set();
      const retrievedSessions = await getPastSessions(props.database, limit);
      let filteredSessions: Array<Session> = sessionFilter(
        props.database,
        retrievedSessions,
        filter,
        limit
      );
      for (let session of filteredSessions) {
        const deckNames = await getUniqueDeckNamesFromSessions(
          props.database,
          session
        );
        const sessionCards: Array<SessionCard> = (await session.cards) as Array<
          SessionCard
        >;
        const numberCorrect = sessionCards.map((sc) => sc.is_correct).length;
        const score = numberCorrect / sessionCards.length;
        highestScore =
          isNaN(highestScore) || score > highestScore ? score : highestScore;
        lowestScore =
          isNaN(lowestScore) || score < lowestScore ? score : lowestScore;
        rows = rows.concat(
          createSessionData(
            index,
            sessionCards.length,
            numberCorrect,
            session.created_at,
            session.ended_at,
            deckNames
          )
        );
      }
    } else {
      throw new Error(
        "Command not currently supported: " + props.complexCommandParams
      );
    }
    averageScore =
      rows.reduce(function (sum, a) {
        return sum + a.score;
      }, 0) / (rows.length || 1);
    return { rows, highestScore, lowestScore, averageScore };
  }

  function getColumnType() {
    if (isLimitAppliedToCards) {
      return ColumnType.CARD_COLUMNS;
    }
    switch (subject) {
      case Subject.Decks: {
        return ColumnType.DECK_COLUMNS;
      }
      case Subject.Sessions: {
        return ColumnType.SESSION_COLUMNS;
      }
      case Subject.Tags: {
        return ColumnType.DECK_COLUMNS;
      }
    }
  }

  // Asynchronously load the data and change the state when done
  useEffect(() => {
    const setStatsObject = async () => {
      try {
        const statsObject = await createStatsObject();
        setState({ view: View.READY, statsObject });
      } catch (err) {
        setState({ view: View.ERROR, error: err });
      }
    };
    setStatsObject();
  }, []);

  // Conditionally render loading screen, error message, or the actual data
  // Feel free to change this however you'd like, this is just some placeholder
  if (state.view === View.LOADING) {
    return <CircularProgress style={{ margin: "auto" }}></CircularProgress>;
  } else if (state.view === View.ERROR) {
    console.log(state.error);
    return (
      <h1 style={{ margin: "auto" }}>
        Something went wrong when trying to fetch the stats
      </h1>
    );
  } else {
    return (
      <>
        <div className="right-side-container">
          <h1> Statistics</h1>
          <StatisticsOverview overview={state.statsObject.overview} />
          <StatisticsTable
            rows={state.statsObject.details}
            columnType={state.statsObject.columnType}
          />
        </div>
      </>
    );
  }
}
