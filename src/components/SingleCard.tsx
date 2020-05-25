import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

export default function SingleCard(props) {
  return (
    <Card style={{ width: "25em", height: "15em" }}>
      <CardContent style={{ paddingTop: "6.5em" }}>
        <Typography color="textSecondary" gutterBottom>
          {props.content}
        </Typography>
      </CardContent>
    </Card>
  );
}
