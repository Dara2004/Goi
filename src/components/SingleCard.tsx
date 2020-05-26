import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";

const StyledH2 = styled.h2`
  font-weight: normal;
  color: ${(props) => props.color || "black"} !important;
  width: ${(props) => (props.direction === "vertical" ? "" : "100%")};
  height: ${(props) => (props.direction === "vertical" ? "100%" : "")};
  text-align: ${(props) => {
    if (props.direction === "vertical") {
      return "left";
    } else if (
      props.alignment === "left" ||
      (props.alignment === "right" && props.direction === "horizontal")
    ) {
      return props.alignment;
    } else return "center";
  }};
  padding: 15px;
`;

// will be horizontal if direction is undefined
const StyledCard = styled(Card)`
  width: ${(props) => (props.direction === "vertical" ? "15em" : "25em")};
  height: ${(props) => (props.direction === "vertical" ? "25em" : "15em")};
  writing-mode: ${(props) =>
    props.direction === "vertical" ? "vertical-rl" : ""};
`;

const StyledCardContent = styled(CardContent)`
  height: 100%;
  width: 100%;
  padding: 0;
  display: flex;
  align-items: ${(props) => {
    if (props.direction === "vertical" && props.alignment === "right") {
      return "flex-start";
    } else if (props.direction === "vertical" && props.alignment === "left") {
      return "flex-end";
    } else return "center";
  }};
`;

export default function SingleCard(props) {
  let color = "";
  let direction = "";
  let alignment = "";
  if (props.attributes) {
    props.attributes.forEach((a) => {
      const attributeType = a.attributeType;
      switch (attributeType) {
        case "color":
          color = a.value;
          break;
        case "direction":
          direction = a.value;
          break;
        case "alignment":
          alignment = a.value;
          break;
      }
    });
  }
  return (
    <StyledCard direction={direction}>
      <StyledCardContent alignment={alignment} direction={direction}>
        <StyledH2 color={color} alignment={alignment} direction={direction}>
          {props.content}
        </StyledH2>
      </StyledCardContent>
    </StyledCard>
  );
}
