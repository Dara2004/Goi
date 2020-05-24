import React from "react";
import StatisticsTable from "./StatisticsTable";
import StatisticsOverview from "./StatisticsOverview";
import { ColumnType } from "./StatisticsTable";
import { createCardData } from "../lib/utils";

function getStatsObject() {
  // temp return object for testing:
  return {
    overview: {
      "average score": "5",
      "highest score": "10",
      "lowest score": "10",
      "average time": "12min",
      "total time": "80min",
    },
    details: [
      createCardData(1, "Bonjour", "Hello", 1, 10, "French", [
        "test1",
        "test2",
      ]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
      createCardData(2, "Aurevoir", "Bye", 5, 10, "French", ["test1", "test2"]),
    ],
  };
}

export default function Statistics() {
  const statsObject = getStatsObject();
  return (
    <>
      <div className="right-side-container">
        <h1> Statistics</h1>
        <StatisticsOverview overview={statsObject.overview} />
        <StatisticsTable
          rows={statsObject.details}
          columnType={ColumnType.CARD_COLUMNS}
        />
      </div>
    </>
  );
}
