import React from "react";
import SlideShow from "./SlideShow";

export default function Session() {
    return (
        <>
            <div className="session-header">
                <h2>Session</h2>
                <h3>DURATION: </h3>
                <h3>DURATION: </h3>
            </div>
            <div className="progress-bar"></div>
            <div className="session-container">
                <SlideShow></SlideShow>
            </div>
        </>
    )
}
