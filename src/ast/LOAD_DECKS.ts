import NODE from "./NODE";
import { getAndCheckToken } from "../lib/tokenizer";

export default class LOAD_DECKS extends NODE {
  parse() {
    getAndCheckToken("load decks");
  }
}
