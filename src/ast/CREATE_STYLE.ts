import STYLE from "./STYLE";
import NODE from "./NODE";

export default class CREATE_STYLE extends NODE {
  name: string = "";
  styles: STYLE[] = [];

  parse() {
    this.tokenizer.getAndCheckToken("Create Style");
    this.name = this.tokenizer.getNext();
    while (
      this.tokenizer.moreTokens() &&
      !this.tokenizer.checkToken("Create Deck")
    ) {
      let style = new STYLE();
      style.parse();
      this.styles.push(style);
    }
  }

    evaluate() {
        // stub
        throw new Error('Not implemented');
    }
}
