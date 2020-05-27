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
  "cards from",
];
export const validCardFilter = ["best", "worst", "random", "oldest", "newest"];
export const subjectKeywords = ["decks:", "tags:", "past sessions"];

export const allTokens = [...validCardFilter, ...keywords, ...subjectKeywords];

export const deckCreationLiterals = ["create deck", ":", "\\(", "\\)", ","];
