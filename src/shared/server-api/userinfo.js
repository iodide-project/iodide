import { readJSONAPIRequest } from "./api-request";

export function userInfoRequest() {
  return readJSONAPIRequest("/userinfo/", true);
}
