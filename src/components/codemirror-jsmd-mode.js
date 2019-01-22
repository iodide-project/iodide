/* eslint-disable no-param-reassign */
/* need to disable no-param-reassign b/c codemirror require mutating state */
import CodeMirror from "codemirror";

import "codemirror/mode/javascript/javascript";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/css/css";
import "codemirror/mode/htmlmixed/htmlmixed";
// FIXME perhaps python should only load if used, but this is fine for now
import "codemirror/mode/python/python";

export const delimLineRegex = /^%%\s*(\w*)/;

const innerModes = {
  js: CodeMirror.getMode(
    { indentUnit: 2, statementIndent: 2 },
    { name: "javascript" }
  ),
  py: CodeMirror.getMode(
    { indentUnit: 4, hangingIndent: 4 },
    { name: "python" }
  ),
  md: CodeMirror.getMode({}, { name: "markdown" }),
  css: CodeMirror.getMode({ indentUnit: 2 }, { name: "css" }),
  raw: CodeMirror.getMode({}, { name: "text/plain" }),
  fetch: CodeMirror.getMode({}, { name: "fetch" })
};
innerModes.raw.startState = () => null;

CodeMirror.defineMode("jsmd", () => ({
  startState: () => ({
    localMode: innerModes.raw,
    localState: null
  }),
  token: (stream, state) => {
    let thisToken;
    let delimLineMatch;
    let chunkType;
    if (stream.sol() && stream.peek() === "%") {
      const match = stream.match(delimLineRegex, false);
      if (match !== null) {
        [delimLineMatch, chunkType] = match;
      }
    }
    if (delimLineMatch) {
      // if this is a delim line, set the token and advance the stream
      thisToken = "line-background-cm-jsmd-delim-line";
      stream.skipToEnd();
      // handle the chunkType
      if (chunkType !== "") {
        // only change the inner mode if a new chunk type is delared
        if (Object.keys(innerModes).includes(chunkType)) {
          // if the chunkType is known, use the corresponding mode
          state.localMode = innerModes[chunkType];
        } else {
          // if the chunk type is not know, use the raw text mode
          state.localMode = innerModes.raw;
        }
      }
      // reset the state of the localmode
      state.localState = state.localMode.startState(0);
    } else {
      thisToken = state.localMode.token(stream, state.localState);
    }
    return thisToken;
  },

  indent: (state, textAfter, line) => {
    if (state.localMode.indent) {
      const indent = state.localMode.indent(state.localState, textAfter, line);
      return indent;
    }
    return CodeMirror.Pass;
  },

  // this copyState method is kind of an incantation...
  // i don't really know if it does anything, but I _think_ i may
  // have seen it fix an edge case
  copyState: state => {
    let local;
    if (state.localState) {
      local = CodeMirror.copyState(state.localMode, state.localState);
    }
    return {
      localMode: state.localMode,
      localState: local
    };
  },

  innerMode: state => ({ state: state.localState, mode: state.localMode })
}));
