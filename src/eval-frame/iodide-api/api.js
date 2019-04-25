/* global IODIDE_VERSION */

// The "Public API" for notebooks. This lets notebooks and third-party plugins
// extend and manipulate the notebook

import UserReps from "../components/reps/user-reps-manager";
import { environment } from "./environment";
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
  // FIXME remove addOutputHandler once pyodide updates to stop using it
  addOutputHandler: oldStyleRendererSpec => {
    console.warn(`iodide.addOutputHander is deprecated.
Please use iodide.addOutputRenderer with a renderer spec object
containing the fields "shouldRender" and "render`);

    UserReps.addRenderer({
      shouldRender: oldStyleRendererSpec.shouldHandle,
      render: oldStyleRendererSpec.render
    });
  },
  clearOutputRenderers: (...params) => UserReps.clearRenderers(...params),
  getDataSync,
  environment,
  output,
  file,
  VERSION: IODIDE_VERSION
};

export default iodide;
