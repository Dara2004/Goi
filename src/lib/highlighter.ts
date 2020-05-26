export type Range = { lineNumber: number; charStart: number; charEnd: number };

/**
 * Applies syntax highlighting to a CodeMirror editor
 * Should be called onChange
 *
 * @param editor The CodeMirror Editor instance
 * @param literals lower case strings for exact matching
 * @param className CSS classname (optional)
 */
export function highlight(
  editor: CodeMirror.Editor,
  literals: string[],
  className?: string
) {
  const doc = editor.getDoc();
  const value = doc.getValue();
  const highlights = getHighlights(value, literals);
  highlights.forEach((highlight) => {
    doc.markText(
      { line: highlight.lineNumber, ch: highlight.charStart },
      { line: highlight.lineNumber, ch: highlight.charEnd },
      { className: className || "syntax-highlight" }
    );
  });
}

function getHighlights(program: string, literals: string[]): Range[] {
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
