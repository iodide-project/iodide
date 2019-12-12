export function jsScriptLoaded(scriptUrl, evalFrameUUID) {
  return {
    type: "traceback/JS_SCRIPT_LOADED",
    scriptUrl,
    evalFrameUUID
  };
}
