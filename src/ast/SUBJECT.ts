import NODE from "./NODE";
import TAGS from "./TAGS";
import DECKS from "./DECKS";
import SESSIONS from "./SESSIONS";

export default class SUBJECT extends NODE {
  subject: TAGS | DECKS | SESSIONS | null = null;

  parse() {
    const nextToken = this.tokenizer.checkNext();
    if (nextToken === "past sessions") {
      this.subject = new SESSIONS();
    } else if (nextToken === "decks:") {
      this.subject = new DECKS();
    } else if (nextToken === "tags:") {
      this.subject = new TAGS();
    } else {
      throw new Error(
        "Invalid Subject, must be 'Decks:', 'Tags:', or 'Past Sessions'"
      );
    }
    this.subject.parseInteractivePrompt();
  }
}
