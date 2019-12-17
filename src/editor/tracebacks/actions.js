export function jsScriptLoaded(scriptUrl, tracebackId) {
  return {
    type: "traceback/JS_SCRIPT_LOADED",
    scriptUrl,
    tracebackId
  };
}

export function recordTracebackInfo(
  historyId,
  tracebackId,
  language,
  startLine,
  endLine
) {
  return {
    type: "traceback/RECORD_TRACEBACK_INFO",
    historyId,
    tracebackId,
    language,
    startLine,
    endLine
  };
}
