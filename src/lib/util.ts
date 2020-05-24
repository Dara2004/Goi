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
  isCorrect: boolean
) {
  const results = isCorrect ? "correct" : "incorrect";
  const indexString = index.toString() + ".)";
  return { indexString, front, back, results };
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
