/* eslint-disable no-param-reassign */
/* need to disable no-param-reassign b/c codemirror require mutating state */
import CodeMirror from 'codemirror'

CodeMirror.defineMode('jsmd', () => {
  const jsMode = CodeMirror.getMode({}, { name: 'javascript' })
  const mdMode = CodeMirror.getMode({}, { name: 'markdown' })
  const plainMode = CodeMirror.getMode({}, { name: 'text/plain' })

  return {
    startState: () => ({
      localMode: plainMode,
      localState: null,
    }),
    // copyState: (state) => {
    //   var local;
    //   if (state.localState) {
    //     local = CodeMirror.copyState(state.localMode, state.localState);
    //   }
    //   return {
    //     token: state.token, inTag: state.inTag,
    //     localMode: state.localMode, localState: local,
    //     htmlState: CodeMirror.copyState(htmlMode, state.htmlState)
    //   };
    // },
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
      } else if (stream.sol() && stream.match(/%%.*/, true)) {
        // any '%%' without a known chunk type just
        // delimits the block without changing mode
        // NB: this has to come last!!!
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
