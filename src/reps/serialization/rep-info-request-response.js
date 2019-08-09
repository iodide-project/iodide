import { getChildSummary } from "./get-child-summaries";
import { getTopLevelRepSummary } from "./get-top-level-rep-summary";
import { getDataTableSummary } from "./get-data-table-summary";
import { getValueSummary } from "./get-value-summary";

// FIXME rather than passing down rootObjName
// we can set the environment to have the correct mapping to
// "window" and "IODIDE_EVALUATION_RESULTS", and we can just pass the
// _actual_ root object down to the callee functions at this point
export function repInfoRequestResponse(payload, environment) {
  const { rootObjName, pathToEntity, requestType } = payload;
  switch (requestType) {
    case "TOP_LEVEL_SUMMARY":
      return getTopLevelRepSummary(
        rootObjName,
        pathToEntity,
        environment && environment.userRepManager
      );
    case "ROW_TABLE_PAGE_SUMMARY":
      return getDataTableSummary(
        rootObjName,
        pathToEntity,
        payload.pageSize,
        payload.page,
        payload.sorted
      );
    case "VALUE_SUMMARY":
      return getValueSummary(rootObjName, pathToEntity);
    case "CHILD_SUMMARY":
      return getChildSummary(rootObjName, pathToEntity);
    default:
      throw new Error("unknown rep request type");
  }
}
