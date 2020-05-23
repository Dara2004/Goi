import Tokenizer from "../lib/tokenizer";

export default class NODE {
  tokenizer = Tokenizer.getTokenizer();
  parse() {
    throw new Error("parse not implemented");
  }
  evaluate() {
    throw new Error("evaluate not implemented");
  }
}
