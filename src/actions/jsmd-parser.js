function hashCode(str) {
  // this is an implementation of java's hashcode method
  // https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
  let hash = 0;
  let chr;
  if (str.length !== 0) {
    for (let i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr // eslint-disable-line
      hash |= 0 // eslint-disable-line
    }
  }
  return hash.toString();
}

export function jsmdParser(fullJsmd) {
  const jsmdLines = fullJsmd.split("\n");
  const chunks = [];
  let currentChunkLines = [];
  let currentEvalType = "";
  let evalFlags = [];
  let currentChunkStartLine = 0;

  const newChunkId = str => {
    const hash = hashCode(str);
    let hashNum = "0";
    for (const chunk of chunks) {
      const [prevHash, prevHashNum] = chunk.chunkId.split("_");
      if (hash === prevHash) {
        hashNum = (parseInt(prevHashNum, 10) + 1).toString();
      }
    }
    return `${hash}_${hashNum}`;
  };

  const pushChunk = endLine => {
    const chunkContent = currentChunkLines.join("\n");
    chunks.push({
      chunkContent,
      chunkType: currentEvalType,
      chunkId: newChunkId(chunkContent),
      evalFlags,
      startLine: currentChunkStartLine,
      endLine
    });
  };

  for (const [i, line] of jsmdLines.entries()) {
    if (line.slice(0, 2) === "%%") {
      // if line start with '%%', a new chunk has started
      // push the current chunk (unless it's on line 0), then reset
      if (i !== 0) {
        // DON'T push a chunk if we're only on line 0
        pushChunk(i - 1);
      }
      // reset the currentChunk state
      currentChunkStartLine = i;
      currentChunkLines = [];
      evalFlags = [];
      // find the first char on this line that isn't '%'
      let lineColNum = 0;
      while (line[lineColNum] === "%") {
        lineColNum += 1;
      }
      const chunkFlags = line
        .slice(lineColNum)
        .split(/[ \t]+/)
        .filter(s => s !== "");
      if (chunkFlags.length > 0) {
        // if there is a captured group, update the eval type
        [currentEvalType, ...evalFlags] = chunkFlags;
      }
    } else {
      // if there is no match, then the line is not a
      // chunk delimiter line, so add the line to the currentChunk
      currentChunkLines.push(line);
    }
  }
  // this is what's left over in the final chunk
  pushChunk(jsmdLines.length - 1);
  return chunks;
}
