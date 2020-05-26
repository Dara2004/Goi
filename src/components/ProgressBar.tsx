import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import PostSessionSummary from "./PostSessionSummary";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export default function ProgressBar({
  cards,
  dispatch,
  setNextCard,
  addCardDataToLocalStorage,
  currentCard,
  currentResult,
  setResult,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setNextCard(activeStep + 1);
    if (activeStep == cards.length - 1) {
      dispatch(true);
    }
    if (!currentResult) {
      addCardDataToLocalStorage(currentCard, activeStep, undefined);
    } else {
      setResult("");
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setNextCard(activeStep - 1);
  };

  return (
    <>
      <MobileStepper
        variant="text"
        steps={cards.length}
        position="static"
        activeStep={activeStep}
        className={classes.root}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === cards.length}
          >
            Next
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
      <MobileStepper
        variant="progress"
        steps={cards.length}
        position="static"
        activeStep={activeStep}
        className={classes.root}
        nextButton={
          <Button
            onClick={handleNext}
            disabled={activeStep === cards.length - 1}
          ></Button>
        }
        backButton={
          <Button onClick={handleBack} disabled={activeStep === 0}></Button>
        }
      />
    </>
  );
}
