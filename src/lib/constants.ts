export const keywords = [
  "Show stats for",
  "Start Session from",
  "Help",
  "List",
  "Export decks",
  "Load decks",
  ",",
  "Past Sessions",
  "cards from",
];
export const validCardFilter = ["best", "worst", "random", "oldest", "newest"];
export const subjectKeywords = ["Decks:", "Tags:", "Sessions"];

export const allTokens = [...validCardFilter, ...keywords, ...subjectKeywords];

export const deckCreationLiterals = ["Create Deck", ":", "\\(", "\\)", ","];
