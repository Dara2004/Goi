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
  if (isForSummary) {
    const results = correct ? "correct" : "incorrect";
    const indexString = index.toString() + ".)";
    return { indexString, front, back, results };
  } else {
    const score = correct.toString() + "/" + (incorrect + correct).toString();
    const tagsString = tags.join(", ");
    const indexString = index.toString() + ".)";
    return { indexString, front, back, score, deck, tagsString };
  }
}
