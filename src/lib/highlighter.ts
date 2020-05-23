export type Range = { lineNumber: number; charStart: number; charEnd: number };

// Produces highlight ranges based on literals (matches the first instance in each line)
// expects lower case literals
export function getHighlights(program: string, literals: string[]): Range[] {
  program = program.toLowerCase();
  const lines = program.split("\n");
  const ranges: Range[] = [];
  lines.forEach((line, lineNumber) => {
    literals.forEach((literal) => {
      const idx = line.indexOf(literal);
      if (idx !== -1) {
        ranges.push({
          lineNumber,
          charStart: idx,
          charEnd: idx + literal.length,
        });
      }
    });
  });
  return ranges;
}
