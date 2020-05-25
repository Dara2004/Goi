import React from "react";
import StatisticsTable from "./StatisticsTable";
import { ColumnType } from "./StatisticsTable";
import ConfettiEmoji from "../assets/confettiEmoji.png";
import { createSummaryData } from "../lib/utils";

function getSessionCards() {
  const sessionDataString = localStorage.getItem("sessionData");
  const sessionData = sessionDataString && JSON.parse(sessionDataString);
  const endedAt = sessionData["ended_at"];
  const createdAt = sessionData["created_at"];
  const endedAtObj = new Date(endedAt);
  const createdAtObj = new Date(createdAt);
  const totalTimeInMS = endedAtObj.getTime() - createdAtObj.getTime();
  const totalMinutes = Math.floor(totalTimeInMS / 60000);
  const totalSeconds = ((totalTimeInMS % 60000) / 1000).toFixed(0);
  const totalTime = `${totalMinutes} min ${totalSeconds} sec`;
  const cardDataArray = sessionData["cardDataArray"];
  const cardSummaryDataArray =
    cardDataArray &&
    sessionData["cardDataArray"].map((c) => {
      return createSummaryData(
        c["card_index"] + 1,
        c["front"],
        c["back"],
        c["is_correct"]
      );
    });
  return {
    overview: { "total time": totalTime },
    details: cardSummaryDataArray || [],
  };
}

function getSessionScore(cardArray: any[]): [string, boolean] {
  const reducer = (accumulator, currentValue) => {
    const cardNumerator =
      currentValue && currentValue.results === "correct" ? 1 : 0;
    return accumulator + cardNumerator;
  };
  const numerator = cardArray.reduce(reducer, 0);
  const denominator = cardArray.length;

  const numeratorString = numerator && numerator.toString();
  const denominatorString = denominator && denominator.toString();

  const sessionScore = [numeratorString, denominatorString].join("/");
  const isAllCorrect = numerator === denominator && denominator !== 0;

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
