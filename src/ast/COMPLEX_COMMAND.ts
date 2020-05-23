import NODE from "./NODE";
import SUBJECT from "./SUBJECT";
import SUBJECT_MODIFIER from "./SUBJECT_MODIFIER";

export default class COMPLEX_COMMAND extends NODE {
  subjectModfier: SUBJECT_MODIFIER | null = null;
  subject: SUBJECT | null = null;
  parse() {
    this.subjectModfier = new SUBJECT_MODIFIER();
    this.subjectModfier.parse();

    this.subject = new SUBJECT();
    this.subject.parse();
  }
}
