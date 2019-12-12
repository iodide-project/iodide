export default function reducer(state, action) {
  const { tracebackInfo } = state;
  switch (action.type) {
    case "traceback/JS_SCRIPT_LOADED": {
      const { scriptUrl, evalFrameUUID } = action;
      const { loadedScripts } = tracebackInfo;
      return {
        ...state,
        tracebackInfo: {
          ...tracebackInfo,
          loadedScripts: {
            ...loadedScripts,
            [evalFrameUUID]: {
              scriptUrl,
              evalFrameUUID,
              fileName: scriptUrl.split("/").pop()
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
