import { getObjAtPath } from "./get-child-summaries";
import { serializeForValueSummary } from "./value-summary-serializer";

export function getValueSummary(rootObjName, path) {
  return serializeForValueSummary(getObjAtPath(window[rootObjName], path));
}
