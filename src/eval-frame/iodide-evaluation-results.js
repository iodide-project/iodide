export const IODIDE_EVALUATION_RESULTS = {};
// FIXME: this should not be atttached to window --
// in repInfoRequestResponse, we can set the environment to use the correct
// root object rather than passing down rootObjName
window.IODIDE_EVALUATION_RESULTS = IODIDE_EVALUATION_RESULTS;
