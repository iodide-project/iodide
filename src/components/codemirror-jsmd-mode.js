/* eslint-disable no-param-reassign */
/* need to disable no-param-reassign b/c codemirror require mutating state */
import CodeMirror from 'codemirror'

CodeMirror.defineMode('jsmd', () => {
  const jsMode = CodeMirror.getMode({}, { name: 'javascript' })
  const mdMode = CodeMirror.getMode({}, { name: 'markdown' })
  const plainMode = CodeMirror.getMode({}, { name: 'text/plain' })
  const fetchMode = CodeMirror.getMode({}, { name: 'fetch' })

  return {
    startState: () => ({
      localMode: plainMode,
      localState: null,
    }),
    token: (stream, state) => {
      let thisToken
      if (stream.sol() && stream.match(/%%\s*js.*/, true)) {
        thisToken = 'line-background-cm-jsmd-delim-line'
        state.localMode = jsMode
        state.localState = jsMode.startState()
      } else if (stream.sol() && stream.match(/%%\s*md.*/, true)) {
        thisToken = 'line-background-cm-jsmd-delim-line'
        state.localMode = mdMode
        state.localState = mdMode.startState()
      } else if (stream.sol() && stream.match(/%%\s*fetch.*/, true)) {
        thisToken = 'line-background-cm-jsmd-delim-line'
        state.localMode = fetchMode
        state.localState = fetchMode.startState()
      } else if (stream.sol() && stream.match(/%%.*/, true)) {
        // NB: THIS ELSE IF HAS TO COME LAST !!!!!
        // any '%%' without a known chunk type just
        // delimits the block without changing mode
        thisToken = 'line-background-cm-jsmd-delim-line'
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
  }
})
