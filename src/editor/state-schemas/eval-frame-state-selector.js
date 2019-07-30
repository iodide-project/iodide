import { pick } from "lodash";

// these state props will be copied over entirely
const propsToCopy = [
  "panePositions.ReportPositioner",
  "viewMode",
  "notebookInfo.files"
];

export default function evalFrameStateSelector(state) {
  const evalFrameState = pick(state, propsToCopy);

  const reportChunkTypes = Object.keys(state.languageDefinitions).concat([
    "md",
    "html",
    "css"
  ]);

  // add propertiess that need special handling
  evalFrameState.reportChunks = state.iomdChunks
    .filter(c => reportChunkTypes.includes(c.chunkType))
    .map(c => pick(c, ["chunkContent", "chunkType", "chunkId"]));

  return evalFrameState;
}
