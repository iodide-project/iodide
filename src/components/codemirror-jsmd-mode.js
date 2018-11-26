/* eslint-disable no-param-reassign */
/* need to disable no-param-reassign b/c codemirror require mutating state */
import CodeMirror from 'codemirror'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/css/css'
import 'codemirror/mode/htmlmixed/htmlmixed'

export const delimLineRegex = /^%%\s*(\w*)/

export const innerModes = {
  js: CodeMirror.getMode({}, { name: 'javascript' }),
  md: CodeMirror.getMode({}, { name: 'markdown' }),
  css: CodeMirror.getMode({}, { name: 'css' }),
  raw: CodeMirror.getMode({}, { name: 'text/plain' }),
  fetch: CodeMirror.getMode({}, { name: 'fetch' }),
}
innerModes.raw.startState = () => null

CodeMirror.defineMode('jsmd', () => ({
  startState: () => ({
    localMode: innerModes.raw,
    localState: null,
  }),
  token: (stream, state) => {
    let thisToken
    let delimLineMatch
    let chunkType
    if (stream.sol() && stream.peek() === '%') {
      const match = stream.match(delimLineRegex, false)
      if (match !== null) { [delimLineMatch, chunkType] = match }
    }
    if (delimLineMatch) {
      // if this is a delim line, set the token and advance the stream
      thisToken = 'line-background-cm-jsmd-delim-line'
      stream.skipToEnd()
      // handle the chunkType
      if (chunkType !== '') {
        // only change the inner mode if a new chunk type is delared
        if (Object.keys(innerModes).includes(chunkType)) {
          // if the chunkType is known, use the corresponding mode
          state.localMode = innerModes[chunkType]
        } else {
          // if the chunk type is not know, use the raw text mode
          state.localMode = innerModes.raw
        }
      }
      // reset the state of the localmode
      state.localState = state.localMode.startState()
    } else {
      thisToken = state.localMode.token(stream, state.localState)
    }
    return thisToken
  },

  indent: (state, textAfter, line) => {
    if (state.localMode.indent) {
      const indent = state.localMode.indent(state.localState, textAfter, line)
      console.log('indent:', indent)
      return indent
    }
    console.log('no local indent available')
    return CodeMirror.Pass
  },

  innerMode: state => ({ state: state.localState, mode: state.localMode }),
}))

