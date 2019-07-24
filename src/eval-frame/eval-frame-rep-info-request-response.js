import UserRepsManagerObj from "./iodide-api/user-reps-manager";
import { repInfoRequestResponse } from "../reps/rep-utils/rep-info-request-response";

export function repInfoRequestResponseFromEvalFrame(payload) {
  return repInfoRequestResponse(payload, {
    userRepManager: UserRepsManagerObj
  });
}
