// import { repInfoRequestResponse } from "./rep-utils/rep-info-request-response";
import messagePasserEditor from "../shared/utils/redux-to-port-message-passer";

export async function requestRepInfo(payload) {
  // return repInfoRequestResponse(payload);
  return messagePasserEditor.postMessageAndAwaitResponse(
    "REP_INFO_REQUEST",
    payload
  );
}
