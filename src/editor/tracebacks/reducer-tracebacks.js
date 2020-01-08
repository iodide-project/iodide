export default function reducer(state, action) {
  const { tracebackInfo } = state;
  switch (action.type) {
    case "traceback/JS_SCRIPT_LOADED": {
      const { scriptUrl, tracebackId } = action;
      const { tracebackItems } = tracebackInfo;
      return {
        ...state,
        tracebackInfo: {
          ...tracebackInfo,
          tracebackItems: {
            ...tracebackItems,
            [tracebackId]: {
              tracebackType: "FETCHED_JS_SCRIPT",
              scriptUrl,
              tracebackId,
              fileName: scriptUrl.split("/").pop()
            }
          }
        }
      };
    }
    case "traceback/RECORD_TRACEBACK_INFO": {
      const { evalId, tracebackId } = action;
      const { tracebackItems } = tracebackInfo;
      return {
        ...state,
        tracebackInfo: {
          ...tracebackInfo,
          tracebackItems: {
            ...tracebackItems,
            [tracebackId]: {
              tracebackType: "USER_EVALUATION",
              evalId,
              tracebackId
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
