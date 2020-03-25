export function jsScriptLoaded(scriptUrl, jsScriptTagBlobId) {
  return {
    type: "traceback/JS_SCRIPT_LOADED",
    scriptUrl,
    jsScriptTagBlobId
  };
}

export function recordTracebackInfo(evalId, jsScriptTagBlobId, language) {
  return {
    type: "traceback/RECORD_TRACEBACK_INFO",
    evalId,
    jsScriptTagBlobId,
    language
  };
}

export function recordErrorStack(evalId, errorStack) {
  return {
    type: "traceback/RECORD_ERROR_STACK",
    evalId,
    errorStack
  };
}
