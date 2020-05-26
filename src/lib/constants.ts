export const keywords = [
  "show stats for",
  "start session from",
  "help",
  "list",
  "export decks",
  "load decks",
  "quit",
  "back to home",
  ",",
  "past sessions",
  "cards from",
];
export const validCardFilter = ["best", "worst", "random", "oldest", "newest"];
export const subjectKeywords = ["decks:", "tags:", "sessions"];

export const allTokens = [...validCardFilter, ...keywords, ...subjectKeywords];

export const deckCreationLiterals = ["create deck", ":", "\\(", "\\)", ","];
