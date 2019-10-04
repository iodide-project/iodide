// The "Public API" for notebooks. This lets notebooks and third-party plugins
// extend and manipulate the notebook

import UserReps from "./user-reps-manager";
import { output } from "./output";
import { file } from "./file/file";

function getDataSync(url) {
  const re = new XMLHttpRequest();
  re.open("GET", url, false);
  re.send(null);
  return re.response;
}

export const iodide = {
  addOutputRenderer: (...params) => UserReps.addRenderer(...params),
  clearOutputRenderers: (...params) => UserReps.clearRenderers(...params),
  getDataSync,
  output,
  file,
  VERSION: process.env.IODIDE_VERSION,
  COMMIT_HASH: process.env.COMMIT_HASH
};

export default iodide;
