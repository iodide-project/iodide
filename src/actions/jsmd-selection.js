import { getChunkContainingLine } from "./actions";
import { jsmdParser } from "./jsmd-parser";

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
      start: startEnd[0].line,
      end: startEnd[1].line,
      selectedText: sel
    };
  });
  return selectionSet;
}

export function padOutFetchChunk(
  selectedChunkContent,
  fullChunkContent,
  lineNumber,
  side
) {
  const lineToReplace = fullChunkContent.split("\n")[lineNumber];
  const content = selectedChunkContent.split("\n");
  content[side === "start" ? 0 : content.length - 1] = lineToReplace;
  return content.join("\n");
}

export function selectionToChunks(originalSelection, jsmdChunks) {
  const { start, end } = originalSelection;
  const { selectedText } = originalSelection;
  const startingChunk = getChunkContainingLine(jsmdChunks, start);
  const endingChunk = getChunkContainingLine(jsmdChunks, end);

  const selection = jsmdParser(selectedText);

  if (selection[0].chunkType === "") {
    selection[0].chunkType = startingChunk.chunkType;
  }
  if (startingChunk.chunkType === "fetch") {
    selection[0].chunkContent = padOutFetchChunk(
      selection[0].chunkContent,
      startingChunk.chunkContent,
      start - startingChunk.startLine - 1,
      "start"
    );
  }
  if (endingChunk.chunkType === "fetch") {
    const lastSelectedChunk = selection[selection.length - 1];
    lastSelectedChunk.chunkContent = padOutFetchChunk(
      lastSelectedChunk.chunkContent,
      endingChunk.chunkContent,
      end - endingChunk.startLine - 1,
      "end"
    );
    selection[selection.length - 1] = lastSelectedChunk;
  }

  if (startingChunk.chunkType === "plugin") {
    selection[0].chunkContent = startingChunk.chunkContent;
  }
  if (endingChunk.chunkType === "plugin") {
    selection[selection.length - 1].chunkContent = endingChunk.chunkContent;
  }
  return selection;
}

export function removeDuplicatePluginChunksInSelectionSet() {
  const plugins = new Set();
  return selection =>
    selection
      .map(chunk => {
        if (chunk.chunkType === "plugin") {
          if (plugins.has(chunk.chunkContent)) {
            return undefined;
          }
          plugins.add(chunk.chunkContent);
        }
        return chunk;
      })
      .filter(chunk => chunk !== undefined);
}
