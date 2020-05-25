export function debug(...items: any): void {
  if (isDebugEnabled()) {
    console.log(...items);
  }
}

function isDebugEnabled(): boolean {
  return (
    process.env.REACT_APP_DEBUG &&
    process.env.REACT_APP_DEBUG.toLowerCase() === "on"
  );
}

export function shuffle<T>(arr: Array<T>): Array<T> {
  return arr.sort(() => Math.random() - 0.5);
}

export function createCardData(
  index: number,
  front: string,
  back: string,
  correct: number,
  incorrect: number,
  deck: string,
  tags: string[]
) {
  const score = correct.toString() + "/" + (incorrect + correct).toString();
  const tagsString = tags.join(", ");
  const indexString = index.toString() + ".)";
  return { indexString, front, back, score, deck, tagsString };
}

export function createSummaryData(
  index: number,
  front: string,
  back: string,
  isCorrect: boolean,
  deck: string
) {
  let results;
  if (isCorrect === undefined) {
    results = "skipped";
  } else {
    results = isCorrect ? "correct" : "incorrect";
  }
  const indexString = index.toString() + ".)";
  return { indexString, front, back, results, deck };
}

export function createDeckData(
  index: number,
  count: number,
  correct: number,
  incorrect: number,
  duration: number,
  tags: string[]
) {
  const score = correct.toString() + "/" + (incorrect + correct).toString();
  const tagsString = tags.join(", ");
  const indexString = index.toString() + ".)";
  return { indexString, count, score, duration, tagsString };
}

export function createSessionData(
  index: number,
  count: number,
  correct: number,
  incorrect: number,
  duration: number,
  decks: string[],
  tags: string[]
) {
  const score = correct.toString() + "/" + (incorrect + correct).toString();
  const decksString = decks.join(", ");
  const tagsString = tags.join(", ");
  const indexString = index.toString() + ".)";
  return { indexString, count, score, duration, decksString, tagsString };
}
