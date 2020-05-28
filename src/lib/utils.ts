export function debug(...items: any): void {
  if (isDebugEnabled()) {
    console.log(...items);
  }
}

export function debugDB(...items: any): void {
  debug("🍉 ", ...items);
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
  deck: string
) {
  const score = correct.toString() + "/" + (incorrect + correct).toString();
  const indexString = index.toString() + ".)";
  return { indexString, front, back, score, deck };
}

export function createSummaryData(
  index: number,
  front: string,
  back: string,
  isCorrect: boolean,
  deck: string,
  tags?: string[]
) {
  let results;
  if (isCorrect === undefined) {
    results = "skipped";
  } else {
    results = isCorrect ? "correct" : "incorrect";
  }

  let tagsString;
  if (tags && tags.length > 0) {
    tagsString = tags.join(", ");
  } else {
    tagsString = "none";
  }
  const indexString = index.toString() + ".)";
  return { indexString, front, back, results, deck, tagsString };
}

export function createDeckData(
  index: number,
  name: string,
  count: number,
  score: number
) {
  const indexString = index.toString() + ".)";
  return { indexString, name, count, score };
}

export function createSessionData(
  index: number,
  count: number,
  correct: number,
  startDate: number,
  endDate: number,
  decks: string[]
) {
  const score = correct.toString() + "/" + count.toString();
  const decksString = decks.join(", ");
  const indexString = index.toString() + ".)";
  const duration = (endDate - startDate) / 1000;
  const date = new Date(startDate);
  const options = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
  };

  const dateString = date.toLocaleDateString("en-US", options);

  return { indexString, dateString, count, score, duration, decksString };
}

// shuffle function from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function randomize(subjects: any[]): any[] {
  let shuffledCards = subjects;
  for (let i = shuffledCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffledCards[i];
    shuffledCards[i] = shuffledCards[j];
    shuffledCards[j] = temp;
  }
  return shuffledCards;
}
