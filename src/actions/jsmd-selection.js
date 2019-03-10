import { jsmdParser } from "./jsmd-parser";

export function getChunkContainingLine(jsmdChunks, line) {
  const [activeChunk] = jsmdChunks.filter(
    c => c.startLine <= line && line <= c.endLine
  );
  return activeChunk;
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
  // `start` and `end` are line numbers *only*,
  //  not full cursor positions { line, col }
  const { start, end, selectedText } = originalSelection;
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
