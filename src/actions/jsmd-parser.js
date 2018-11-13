export function jsmdParser(fullJsmd) {
  const jsmdLines = fullJsmd.split('\n')
  const chunks = []
  let currentChunkLines = []
  let currentEvalType = ''
  let evalFlags = []
  let currentChunkStartLine = 0

  for (const [i, line] of jsmdLines.entries()) {
    if (line.slice(0, 2) === '%%') {
      // if there is any match, a new chunk has started
      // push the current chunk (unless it's on line 0), then reset
      if (i !== 0) {
        // DON'T push a chunk if we're only on line 0
        chunks.push({
          cellContent: currentChunkLines.join('\n'),
          cellType: currentEvalType,
          evalFlags,
          startLine: currentChunkStartLine,
          endLine: i - 1,
        })
      }
      // reset the currentChunk state
      currentChunkStartLine = i
      currentChunkLines = []
      evalFlags = []
      const chunkFlags = line
        .slice(2)
        .split(/[ \t]+/)
        .filter(s => s !== '')
      if (chunkFlags.length > 0) {
        // if there is a captured group,
        // update the eval type
        [currentEvalType, ...evalFlags] = chunkFlags // eslint-disable-line
      }
    } else {
      // if there is no match, then the line is not a
      // chunk delimiter line, so add the line to the currentChunk
      currentChunkLines.push(line)
    }
  }
  // this is what's left over in the final chunk
  chunks.push({
    cellContent: currentChunkLines.join('\n'),
    cellType: currentEvalType,
    evalFlags,
    startLine: currentChunkStartLine,
    endLine: jsmdLines.length - 1,
  })
  return chunks
}
