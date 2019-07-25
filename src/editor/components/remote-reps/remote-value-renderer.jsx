import { ValueRendererUnwrapped } from "../../../reps/components/value-renderer";
import { wrapValueRenderer } from "../../../reps/components/rep-info-requestor";
import messagePasserEditor from "../../../shared/utils/redux-to-port-message-passer";

const requestTopLevelRepSummary = requestPayload =>
  messagePasserEditor.postMessageAndAwaitResponse(
    "REP_INFO_REQUEST",
    requestPayload
  );

const ValueRenderer = wrapValueRenderer(
  ValueRendererUnwrapped,
  requestTopLevelRepSummary
);

export default ValueRenderer;
