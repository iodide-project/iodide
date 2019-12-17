export default function reducer(state, action) {
  const { tracebackInfo } = state;
  switch (action.type) {
    case "traceback/JS_SCRIPT_LOADED": {
      const { scriptUrl, tracebackId } = action;
      const { loadedScripts } = tracebackInfo;
      return {
        ...state,
        tracebackInfo: {
          ...tracebackInfo,
          loadedScripts: {
            ...loadedScripts,
            [tracebackId]: {
              scriptUrl,
              tracebackId,
              fileName: scriptUrl.split("/").pop()
            }
          }
        }
      };
    }
    case "traceback/RECORD_TRACEBACK_INFO": {
      const { historyId, tracebackId, language, startLine, endLine } = action;
      const { evalRanges } = tracebackInfo;
      return {
        ...state,
        tracebackInfo: {
          ...tracebackInfo,
          evalRanges: {
            ...evalRanges,
            [tracebackId]: {
              historyId,
              tracebackId,
              language,
              originalLines: { startLine, endLine },
              currentLines: { startLine, endLine },
              editedSinceEval: false
            }
          }
        }
      };
    }

    default: {
      return state;
    }
  }
}
