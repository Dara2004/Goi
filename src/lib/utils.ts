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
