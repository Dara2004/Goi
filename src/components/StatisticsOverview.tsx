import React from "react";
import "./styles.css";

function renderHeaderRow(overview) {
  return (
    overview &&
    Object.keys(overview.overview).map((overviewKey) => {
      return (
        <td key={overviewKey} className="overViewTable">
          {overviewKey}
        </td>
      );
    })
  );
}

function renderValueRow(overview) {
  return (
    overview &&
    Object.values(overview.overview).map((overviewValue, index) => {
      return (
        <th
          key={`${overviewValue.toString()}_${index}`}
          className="overViewTable"
        >
          {overviewValue}
        </th>
      );
    })
  );
}

function StatsOverview(overview) {
  return (
    <>
      <table className="overViewTable">
        <tbody className="overViewTable">
          <tr key="statsOverviewHeading" className="overViewTable">
            {renderHeaderRow(overview)}
          </tr>
          <tr key="statsOverviewValues" className="overViewTable">
            {renderValueRow(overview)}
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default StatsOverview;
