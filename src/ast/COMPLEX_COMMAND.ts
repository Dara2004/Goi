import NODE from "./NODE";
import SHOW from "./SHOW";
import START_SESSION from "./START_SESSION";
import SUBJECT from "./SUBJECT";

export default class COMPLEX_COMMAND extends NODE {
  subjectModfier: SHOW | START_SESSION | null = null;
  subject: SUBJECT | null = null;
  parse() {
    const nextToken = this.tokenizer.checkNext();
    if (nextToken === "Show stats for") {
      this.subjectModfier = new SHOW();
      this.subjectModfier.parse();
    } else if (nextToken === "Start Session from") {
      this.subjectModfier = new START_SESSION();
      this.subjectModfier.parse();
    } else {
      throw new Error(
        "Invalid command: did not match 'Help', 'List: ', 'Show stats for', or 'Start Session from"
      );
    }
    this.subject = new SUBJECT();
    this.subject.parse();
  }
}
