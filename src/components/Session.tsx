import React from "react";
import ProgressBar from "./ProgressBar";
import CardFlip from "./CardFlip";
import WrongBtn from "../assets/wrongBtn.svg";
import CorrectBtn from "../assets/correctBtn.svg";

export default function Session() {
  return (
    <>
      <div className="session-container">
        <h1>Session</h1>
        <h3>DURATION: </h3>
        <ProgressBar></ProgressBar>
        <CardFlip></CardFlip>
        <div style={{ textAlign: "center", marginTop: "3em" }}>
          <img src={CorrectBtn} style={{ width: "3em", marginRight: "4em" }} />
          <img src={WrongBtn} style={{ width: "3em" }} />
        </div>
      </div>
    </>
  );
}
