import NODE from "./NODE";
import TAGS from "./TAGS";
import DECKS from "./DECKS";
import SESSIONS from "./SESSIONS";

export default class SUBJECT extends NODE {
  subject: TAGS | DECKS | SESSIONS | null = null;

  parse() {
    const nextToken = this.tokenizer.checkNext();
    if (nextToken === "Past Sessions") {
      this.subject = new SESSIONS();
    } else if (nextToken === "Decks:") {
      this.subject = new DECKS();
    } else if (nextToken === "Tags:") {
      this.subject = new TAGS();
    } else {
      throw new Error(
        "Invalid Subject, must be 'Decks:', 'Tags:', or 'Past Sessions'"
      );
    }
    this.subject.parseInteractivePrompt();
  }
}
