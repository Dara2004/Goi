import React from "react";
import StatisticsTable from "./StatisticsTable";
// TODO
// https://github.com/Dara2004/Goi/issues/49

export default function Statistics() {
  return (
    <>
      <div className="statistics-header">
        <h1> Statistics</h1>
        <StatisticsTable></StatisticsTable>
      </div>
    </>
  );
}
