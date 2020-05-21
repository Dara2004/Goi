export const keywords = [
  "Show stats for",
  "Start Session from",
  "Help",
  "List:",
  ",",
  "Sessions",
  "cards from",
];
export const validCardFilter = ["best", "worst", "random", "oldest", "newest"];
export const validStat = ["minimum", "maximum", "average"];
export const validStatItem = ["time spent on", "scores for"];
export const subjectKeywords = ["Decks:", "Tags:", "Sessions"];

export const allTokens = [
  ...validCardFilter,
  ...validStat,
  ...validStatItem,
  ...keywords,
  ...subjectKeywords,
];
