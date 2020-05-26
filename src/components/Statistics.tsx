import React from "react";
import StatisticsTable from "./StatisticsTable";
import StatisticsOverview from "./StatisticsOverview";
import { ColumnType } from "./StatisticsTable";
import { createCardData } from "../lib/utils";
import { Subject } from "../App";
import { getSelectedDecks, getCardsFromSelectedDecks } from "../model/query";

type Props = { complexCommandParams; database };

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

export default function Statistics(props: Props) {
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

  const statsObject = await createStatsObject();
  return (
    <>
      <div className="right-side-container">
        <h1> Statistics</h1>
        <StatisticsOverview overview={statsObject.overview} />
        <StatisticsTable
          rows={statsObject.details}
          columnType={statsObject.columns}
        />
      </div>
    </>
  );
}
