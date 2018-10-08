/* eslint-disable no-param-reassign */
import CodeMirror from 'codemirror'

CodeMirror.defineMode('jsmd', () => ({
  startState: () => ({ localMode: '' }),

  token: (stream, state) => {
    // If a string starts here

    // if (!state.inString && stream.peek() === '"') {
    //   stream.next() // Skip quote
    //   state.inString = true // eslint-disable-line
    //   // Update state
    // }

    // if (state.inString) {
    //   if (stream.skipTo('"')) { // Quote found on this line
    //     stream.next(); // Skip quote
    //     // Clear flag
    //     state.inString = false; // eslint-disable-line
    //   } else {
    //     stream.skipToEnd(); // Rest of line is string
    //   }
    //   return 'string'; // Token style
    // }

    // const quoteOnThisLine = stream.skipTo('"')
    // if (!quoteOnThisLine) stream.skipToEnd()
    let thisToken
    if (stream.sol() && stream.match('%%')) {
      thisToken = 'line-background-cm-jsmd-delim-line'
      console.log('jsmd delim')
      state.localMode = 'js'
    } else {
      thisToken = null; // Unstyled token
    }
    stream.eol()
    stream.next()
    return thisToken
  },
}))
