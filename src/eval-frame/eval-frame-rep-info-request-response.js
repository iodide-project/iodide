import UserRepsManagerObj from "./iodide-api/user-reps-manager";
import { repInfoRequestResponse } from "../reps/serialization/rep-info-request-response";

export function repInfoRequestResponseFromEvalFrame(payload) {
  return repInfoRequestResponse(payload, {
    userRepManager: UserRepsManagerObj
  });
}
