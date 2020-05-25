import NODE from "./NODE";

export default class EXPORT_DECKS extends NODE {
  parse() {
    this.tokenizer.getAndCheckToken("export decks");
  }

  evaluate() {
    const dataString = localStorage.getItem("cardEditorStrKey");
    let fakeAnchor = document.createElement("a");
    fakeAnchor.href =
      "data:text/plain;charset=utf-8," + encodeURIComponent(dataString);
    fakeAnchor.download = `${new Date().toISOString()}.txt`;
    fakeAnchor.click();
  }
}
