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
