export function shuffle<T>(arr: Array<T>): Array<T> {
  return arr.sort(() => Math.random() - 0.5);
}
