import { ValueRendererUnconnected } from "../../../reps/components/value-renderer";
import { makeValueRendererWithRepRequest } from "../../../reps/components/rep-info-requestor";
import messagePasserEditor from "../../../shared/utils/redux-to-port-message-passer";

const requestTopLevelRepSummary = requestPayload =>
  messagePasserEditor.postMessageAndAwaitResponse(
    "REP_INFO_REQUEST",
    requestPayload
  );

export const WindowValueRenderer = makeValueRendererWithRepRequest(
  ValueRendererUnconnected,
  requestTopLevelRepSummary,
  "window"
);

export const HistoryValueRenderer = makeValueRendererWithRepRequest(
  ValueRendererUnconnected,
  requestTopLevelRepSummary,
  "IODIDE_EVALUATION_RESULTS"
);
