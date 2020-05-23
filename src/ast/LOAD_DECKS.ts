import NODE from "./NODE";

export default class LOAD_DECKS extends NODE {
  parse() {
    this.tokenizer.getAndCheckToken("Load decks");
  }

  evaluate() {
    const fakeInput = document.createElement("input");
    fakeInput.type = "file";

    fakeInput.onchange = (e: any) => {
      const file = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.readAsText(file, "UTF-8");

      fileReader.onload = (e) => {
        const content = e.target.result;
        console.log(content);
      };
    };

    fakeInput.click();
  }
}
