import { getObjAtPath } from "./get-child-summaries";
import { serializeForValueSummary } from "./value-summary-serializer";
import { getErrorStackString } from "./get-error-stack-summary";
import { getInitialDataTableSummary } from "./get-data-table-summary";
import { isRowDf } from "./rep-type-chooser";

export function getTopLevelRepSummary(rootObjName, path, UserRepsManager) {
  const value = getObjAtPath(window[rootObjName], path);

  if (UserRepsManager && UserRepsManager.getUserRepIfAvailable(value)) {
    return {
      repType: "HTML_STRING",
      htmlString: UserRepsManager.getUserRepIfAvailable(value)
    };
  }
  if (value && value.iodideRender instanceof Function) {
    return { repType: "HTML_STRING", htmlString: value.iodideRender() };
  }
  if (value instanceof Error) {
    return { repType: "ERROR_TRACE", errorString: getErrorStackString(value) };
  }
  if (isRowDf(value)) {
    const { rows, pages } = getInitialDataTableSummary(rootObjName, path);
    return { repType: "ROW_TABLE_REP", initialDataRows: rows, pages };
  }

  return {
    repType: "DEFAULT_REP",
    valueSummary: serializeForValueSummary(value)
  };
}
