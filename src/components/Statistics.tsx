import React from "react";
import StatisticsTable from "./StatisticsTable";
import StatisticsOverview from "./StatisticsOverview";

function getStatsObject() {
  // temp return object for testing:
  const rows = [
    createStatsData(1, "Bonjour", "Hello", 1, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    createStatsData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
  ];
  return {
    overview: {
      // overview can have 0 or more of these key value pairs, depending on query
      "average score": "5",
      "highest score": "10",
      "lowest score": "10",
      "average time": "12min",
      "total time": "80min",
    },
    details: rows,
  };
}

function createStatsData(
  index: number,
  front: string,
  back: string,
  correct: number,
  incorrect: number,
  deck: string,
  tags: string[]
) {
  const score = correct.toString() + "/" + incorrect.toString();
  const tagsString = tags.join(", ");
  const indexString = index.toString() + ".)";
  return { indexString, front, back, score, deck, tagsString };
}

export default function Statistics() {
  const statsObject = getStatsObject();
  return (
    <>
      <div className="card-view">
        <h1> Statistics</h1>
        <StatisticsOverview overview={statsObject.overview} />
        <StatisticsTable rows={statsObject.details} />
      </div>
    </>
  );
}
