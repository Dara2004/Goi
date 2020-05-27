import NODE from "./NODE";
import TAGS from "./TAGS";
import DECKS from "./DECKS";
import SESSIONS from "./SESSIONS";

export enum SubjectType {
  Decks = "decks",
  Sessions = "sessions",
  Tags = "tags", // not supported yet
  Undefined = "undefined",
}

export default class SUBJECT extends NODE {
  subject: TAGS | DECKS | SESSIONS | null = null;
  subjectType: SubjectType = SubjectType.Undefined;

  parse() {
    const nextToken = this.tokenizer.checkNext();
    if (nextToken === "past sessions") {
      this.subject = new SESSIONS();
      this.subjectType = SubjectType.Sessions;
    } else if (nextToken === "decks:") {
      this.subject = new DECKS();
      this.subjectType = SubjectType.Decks;
    } else if (nextToken === "tags:") {
      this.subject = new TAGS();
      this.subjectType = SubjectType.Tags;
    } else {
      throw new Error(
        "Invalid Subject, must be 'Decks:', 'Tags:', or 'Past Sessions'"
      );
    }
    this.subject.parseInteractivePrompt();
  }
}
