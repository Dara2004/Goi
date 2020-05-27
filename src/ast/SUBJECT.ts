import NODE from "./NODE";
import TAGS from "./TAGS";
import DECKS from "./DECKS";
import SESSIONS from "./SESSIONS";
import { Subject } from "../App";

export default class SUBJECT extends NODE {
  subject: TAGS | DECKS | SESSIONS | null = null;
  subjectType: Subject = Subject.Undefined;

  parse() {
    const nextToken = this.tokenizer.checkNext();
    if (nextToken === "past sessions") {
      this.subject = new SESSIONS();
      this.subjectType = Subject.Sessions;
    } else if (nextToken === "decks:") {
      this.subject = new DECKS();
      this.subjectType = Subject.Decks;
    } else if (nextToken === "tags:") {
      this.subject = new TAGS();
      this.subjectType = Subject.Tags;
    } else {
      throw new Error(
        "Invalid Subject, must be 'Decks:', 'Tags:', or 'Past Sessions'"
      );
    }
    this.subject.parseInteractivePrompt();
  }
}
