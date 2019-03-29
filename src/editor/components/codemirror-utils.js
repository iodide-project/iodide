export function getAllSelections(doc) {
  const selections = doc.getSelections();
  const selectionLines = doc.listSelections();
  const selectionSet = selections.map((sel, i) => {
    // head & anchor depends on how you drag, so we have to sort by line+ch.
    const startEnd = [selectionLines[i].anchor, selectionLines[i].head];
    startEnd.sort((a, b) => {
      if (a.line > b.line) return 1;
      else if (a.line < b.line) return 0;
      return a.ch > b.ch;
    });
    return {
      start: {
        line: startEnd[0].line,
        col: startEnd[0].ch
      },
      end: {
        line: startEnd[1].line,
        col: startEnd[1].ch
      },
      selectedText: sel
    };
  });
  return selectionSet;
}
