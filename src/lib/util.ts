export function createCardData(
  index: number,
  front: string,
  back: string,
  correct: number,
  incorrect: number,
  deck: string,
  tags: string[],
  isForSummary?: boolean
) {
  let score;
  if (isForSummary) {
    score = correct ? "correct" : "incorrect";
    const indexString = index.toString() + ".)";
    return { indexString, front, back, score };
  } else {
    score = correct.toString() + "/" + (incorrect + correct).toString();
    const tagsString = tags.join(", ");
    const indexString = index.toString() + ".)";
    return { indexString, front, back, score, deck, tagsString };
  }
}
