export default function reducer(state, action) {
  const { tracebackInfo } = state;
  switch (action.type) {
    case "traceback/JS_SCRIPT_LOADED": {
      const { scriptUrl, jsScriptTagBlobId } = action;
      const { tracebackItems } = tracebackInfo;
      return {
        ...state,
        tracebackInfo: {
          ...tracebackInfo,
          tracebackItems: {
            ...tracebackItems,
            [jsScriptTagBlobId]: {
              tracebackType: "FETCHED_JS_SCRIPT",
              scriptUrl,
              jsScriptTagBlobId,
              fileName: scriptUrl.split("/").pop()
            }
          }
        }
      };
    }
    case "traceback/RECORD_TRACEBACK_INFO": {
      const { evalId, jsScriptTagBlobId } = action;
      const { tracebackItems } = tracebackInfo;
      return {
        ...state,
        tracebackInfo: {
          ...tracebackInfo,
          tracebackItems: {
            ...tracebackItems,
            [jsScriptTagBlobId]: {
              tracebackType: "USER_EVALUATION",
              evalId,
              jsScriptTagBlobId
            }
          }
        }
      };
    }

    case "traceback/RECORD_ERROR_STACK": {
      const { evalId, errorStack } = action;
      const { evalErrorStacks } = tracebackInfo;
      return {
        ...state,
        tracebackInfo: {
          ...tracebackInfo,
          evalErrorStacks: {
            ...evalErrorStacks,
            [evalId]: errorStack
          }
        }
      };
    }

    default: {
      return state;
    }
  }
}
