import Tokenizer from "./tokenizer";

export default class NODE {
  fs = require("fs");
  writeDataFile(data) {
    this.fs.writeFile("DataFile.txt", data, (err) => {
      if (err) throw err;
    });
  }
  readDataFile() {
    this.fs.readFile("DataFile.txt", (err, data) => {
      if (err) throw err;
      return data;
    });
  }
  tokenizer = Tokenizer.getTokenizer(); // = getTokenizer(); // TODO: uncomment this after tokenizer is merged
  parse() {
    throw new Error("parse not implemented");
  }
  evaluate() {
    throw new Error("evaluate not implemented");
  }
}
