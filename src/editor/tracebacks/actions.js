export function recordErrorStack(evalId, errorStack) {
  return {
    type: "traceback/RECORD_ERROR_STACK",
    evalId,
    errorStack
  };
}
