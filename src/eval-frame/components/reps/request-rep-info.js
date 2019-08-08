import { repInfoRequestResponse } from "./rep-utils/rep-info-request-response";

export async function requestRepInfo(payload) {
  return repInfoRequestResponse(payload);
}
