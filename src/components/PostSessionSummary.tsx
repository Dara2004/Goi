import React from "react";
import StatisticsTable from "./StatisticsTable";
import { ColumnType } from "./StatisticsTable";
import ConfettiEmoji from "../assets/confettiEmoji.png";
import { createSummaryData } from "../lib/utils";

function getSessionCards() {
  // temp return object for testing:

  // same type of return object as for Stats - assuming the session data will be
  // saved upon session completion, and will be retrieved using the same query as
  // for stats, but only for the current/most recent session
  // because this is only one session, 'correct' and 'incorrect' should only ever be 0 or 1
  return {
    overview: { "total time": "80min" },
    details: [
      createSummaryData(2, "Aurevoir", "Bye", true),
      createSummaryData(3, "Aurevoir", "Bye", true),
      createSummaryData(4, "Aurevoir", "Bye", true),
      createSummaryData(5, "Aurevoir", "Bye", true),
      createSummaryData(6, "Aurevoir", "Bye", true),
      createSummaryData(7, "Aurevoir", "Bye", true),
      createSummaryData(8, "Aurevoir", "Bye", true),
      createSummaryData(9, "Aurevoir", "Bye", true),
    ],
  };
}

function getSessionScore(cardArray: any[]): [string, boolean] {
  const reducer = (accumulator, currentValue) => {
    const cardNumerator =
      currentValue && currentValue.score === "correct" ? 1 : 0;
    return accumulator + cardNumerator;
  };
  const numerator = cardArray.reduce(reducer, 0);
  const denominator = cardArray.length;

  const numeratorString = numerator && numerator.toString();
  const denominatorString = denominator && denominator.toString();

  const sessionScore = [numeratorString, denominatorString].join("/");
  const isAllCorrect = numerator === denominator;

  return [sessionScore, isAllCorrect];
}

export default function PostSessionSummary() {
  const sessionCards = getSessionCards();
  const [score, isAllCorrect]: [string, boolean] = getSessionScore(
    sessionCards.details
  );
  return (
    <div className="right-side-container">
      <h1>Summary</h1>
      <br />
      <h2>You got: {score} cards correct</h2>
      {isAllCorrect && <h2>Good job!!</h2>}
      {isAllCorrect && (
        <img className="confetti" src={ConfettiEmoji} alt={"Confetti"} />
      )}
      <br />
      <h3>Time spent: {sessionCards.overview["total time"]}</h3>
      <br />
      <StatisticsTable
        rows={sessionCards.details}
        columnType={ColumnType.SUMMARY_COLUMNS}
      />
    </div>
  );
}
