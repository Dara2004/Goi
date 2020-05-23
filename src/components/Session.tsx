import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import CardFlip from "./CardFlip";
import WrongBtn from "../assets/wrongBtn.svg";
import CorrectBtn from "../assets/correctBtn.svg";
import ProgressBarText from "./ProgressBarText";

export default function Session() {
  const [result, setResult] = useState("");
  return (
    <>
      <div className="session-container">
        <h1>Session</h1>
        <h3>DURATION: </h3>
        <ProgressBarText></ProgressBarText>
        <ProgressBar></ProgressBar>
        <CardFlip front="Front" back="Back"></CardFlip>
        <div style={{ textAlign: "center", marginTop: "3em" }}>
          <img
            src={CorrectBtn}
            style={{ width: "3em", marginRight: "4em" }}
            onClick={() => {
              setResult("Correct!");
              console.log(result);
            }}
          />
          <img
            src={WrongBtn}
            style={{ width: "3em" }}
            onClick={() => {
              setResult("Incorrect!");
              console.log(result);
            }}
          />
        </div>
        <h2>{result}</h2>
      </div>
    </>
  );
}
