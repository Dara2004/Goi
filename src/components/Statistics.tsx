import React, { useState, useEffect } from "react";
import StatisticsTable from "./StatisticsTable";
import StatisticsOverview from "./StatisticsOverview";
import { ColumnType } from "./StatisticsTable";
import { createCardData } from "../lib/utils";
import { Subject, ComplexCommandParams } from "../App";
import { getSelectedDecks, getCardsFromSelectedDecks } from "../model/query";
import { Database } from "@nozbe/watermelondb";
import { CircularProgress } from "@material-ui/core";

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
    columns: ColumnType.CARD_COLUMNS,
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
    let highestScore = null;
    let lowestScore = null;
    if (isLimitAppliedToCards) {
      let decks = await getSelectedDecks(props.database, deckNames);
      for (let deck of decks) {
        let cards = await deck.cards.fetch();
        let index = 1;
        cards.forEach((card) => {
          const score = card.right / (card.wrong + card.right);
          highestScore =
            highestScore === null || score > highestScore
              ? score
              : highestScore;
          lowestScore =
            lowestScore === null || score < lowestScore ? score : lowestScore;
          rows = rows.concat(
            createCardData(
              index,
              card.front,
              card.back,
              card.right,
              card.wrong,
              deck.name
            )
          );
          index += 1;
        });
      }
    }
    const averageScore =
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
            columnType={state.statsObject.columns}
          />
        </div>
      </>
    );
  }
}
