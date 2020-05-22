import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { Database } from "@nozbe/watermelondb";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";
import schema from "./model/schema";
import Card from "./model/Card";
import Deck from "./model/Deck";
import Session from "./model/Session";
import SessionCard from "./model/SessionCard";
import Tag from "./model/Tag";
import TagCard from "./model/TagCard";

const adapter = new LokiJSAdapter({
  schema,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
});

const database = new Database({
  adapter,
  modelClasses: [Card, Deck, Session, SessionCard, Tag, TagCard],
  actionsEnabled: true,
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
