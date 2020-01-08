export function jsScriptLoaded(scriptUrl, tracebackId) {
  return {
    type: "traceback/JS_SCRIPT_LOADED",
    scriptUrl,
    tracebackId
  };
}

export function recordTracebackInfo(evalId, tracebackId, language) {
  return {
    type: "traceback/RECORD_TRACEBACK_INFO",
    evalId,
    tracebackId,
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
