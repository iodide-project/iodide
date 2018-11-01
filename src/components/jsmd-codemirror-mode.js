/* eslint-disable no-param-reassign */
import CodeMirror from 'codemirror'


// CodeMirror.defineSimpleMode('jsmd', {
//   // The start state contains the rules that are intially used
//   start: [
//     // The regex matches the token, the token property contains the type
//     { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: 'string' },
//     // You can match multiple tokens at once. Note that the captured
//     // groups must span the whole string in this case
//     {
//       regex: /(function)(\s+)([a-z$][\w$]*)/,
//       token: ['keyword', null, 'variable-2']
//     },
//     // Rules are matched in the order in which they appear, so there is
//     // no ambiguity between this one and the one above
//     {
//       regex: /(?:function|var|return|if|for|while|else|do|this)\b/,
//       token: 'keyword'
//     },
//     { regex: /true|false|null|undefined/, token: 'atom' },
//     {
//       regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
//       token: 'number'
//     },
//     { regex: /\/\/.*/, token: 'comment' },
//     { regex: /\/(?:[^\\]|\\.)*?\//, token: 'variable-3' },
//     // A next property will cause the mode to move to a different state
//     { regex: /\/\*/, token: 'comment', next: 'comment' },
//     { regex: /[-+\/*=<>!]+/, token: 'operator' },
//     // indent and dedent properties guide autoindentation
//     { regex: /[\{\[\(]/, indent: true },
//     { regex: /[\}\]\)]/, dedent: true },
//     { regex: /[a-z$][\w$]*/, token: 'variable' },
//     // You can embed other modes with the mode property. This rule
//     // causes all code between << and >> to be highlighted with the XML
//     // mode.,
//     { regex: /<</, token: 'meta', mode: { spec: 'xml', end: />>/ } },
//   ],
//   // The multi-line comment state.
//   comment: [
//     { regex: /.*?\*\//, token: 'comment', next: 'start' },
//     { regex: /.*/, token: 'comment' },
//   ],
//   delimLine: [
//     { regex: /%%/, token: ['comment', 'line-background-cm-jsmd-delim-line'], next: 'js' },
//   ],
//   delimLine: [
//     { regex: /%%\s*js.*/, token: ['comment', 'line-background-cm-jsmd-delim-line'], next: 'js' },
//   ],
//   js: [
//     { regex: /<</, token: 'meta', mode: { spec: 'javascript', end: /%%/ } },
//   ],
//   // The meta property contains global information about the mode. It
//   // can contain properties like lineComment, which are supported by
//   // all modes, and also directives like dontIndentStates, which are
//   // specific to simple modes.
//   meta: {
//     dontIndentStates: ['comment'],
//     lineComment: '//',
//   },
// });

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
        console.log('jsmd delim')
        state.localMode = jsMode
        state.localState = jsMode.startState()
      } else if (stream.sol() && stream.match(/%%\s*md.*/, true)) {
        thisToken = 'line-background-cm-jsmd-delim-line'
        console.log('md delim')
        state.localMode = mdMode
        state.localState = mdMode.startState()
      } else if (stream.sol() && stream.match(/%%.*/, true)) {
        // any '%%' without a known chunk type just
        // delimits the block without changing mode
        // NB: this has to come last!!!
        thisToken = 'line-background-cm-jsmd-delim-line'
        console.log('jsmd delim')
      } else {
        // thisToken = '' // Unstyled token
        thisToken = state.localMode.token(stream, state.localState)
      }
      // stream.eol()
      // stream.next()
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
