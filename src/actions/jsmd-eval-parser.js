export function getEvalInfo(fullJsmd, cursorLine) {
  const jsmdLines = fullJsmd.split('\n')
  let currentChunkLines = []
  let currentEvalType = ''
  let evalFlags = []
  if (cursorLine > jsmdLines.length) {
    throw new Error(`cursor line number (${cursorLine}) greater than document length (${jsmdLines.length})`)
  }

  for (const [i, line] of jsmdLines.entries()) {
    if (line.slice(0, 2) === '%%') {
      if (i > cursorLine) {
        // in this case, we've found the start of the next chunk after the
        // position of the cursor, so return what we have right now.
        return {
          evalText: currentChunkLines.join('\n'),
          evalType: currentEvalType,
          evalFlags,
        }
      }
      // if there is any match, a new chunk has started
      // so reset the currentChunk
      currentChunkLines = []
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
  return {
    evalText: currentChunkLines.join('\n'),
    evalType: currentEvalType,
    evalFlags,
  }
}
