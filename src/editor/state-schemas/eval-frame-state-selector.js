import _ from "lodash";

// these state props will be copied over entirely
const propsToCopy = [
  "appMessages",
  "consoleText",
  "consoleTextCache",
  "consoleScrollbackPosition",
  "history",
  "languageDefinitions",
  "loadedLanguages",
  "languageLastUsed",
  "panePositions.ConsolePositioner",
  "panePositions.ReportPositioner",
  "panePositions.WorkspacePositioner",
  "savedEnvironment",
  "userDefinedVarNames",
  "viewMode",
  "notebookInfo.files"
];

export default function evalFrameStateSelector(state) {
  const evalFrameState = _.pick(state, propsToCopy);

  const reportChunkTypes = Object.keys(state.languageDefinitions).concat([
    "md",
    "html",
    "css"
  ]);

  // add propertiess that need special handling
  evalFrameState.reportChunks = state.jsmdChunks
    .filter(c => reportChunkTypes.includes(c.chunkType))
    .map(c => _.pick(c, ["chunkContent", "chunkType", "chunkId", "evalFlags"]));

  return evalFrameState;
}
