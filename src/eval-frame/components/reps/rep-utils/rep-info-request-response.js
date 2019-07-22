import { getChildSummary } from "./get-child-summaries";
import { getTopLevelRepSummary } from "./get-top-level-rep-summary";
import { getDataTableSummary } from "./get-data-table-summary";
import { getValueSummary } from "./get-value-summary";

export async function repInfoRequestResponse(payload) {
  const { rootObjName, pathToEntity, requestType } = payload;
  switch (requestType) {
    case "TOP_LEVEL_SUMMARY":
      return getTopLevelRepSummary(rootObjName, pathToEntity);
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
