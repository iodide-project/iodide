import { isFinite } from "lodash";
import { getType } from "./value-summary-serializer";

export function isValidChildSumary(maybeSummary) {
  const { childItems, summaryType } = maybeSummary;
  if (childItems === undefined)
    return ["top-level 'childItems' is undefined", maybeSummary];
  if (summaryType === undefined)
    return ["top-level 'summaryType' is undefined", maybeSummary];
  if (getType(summaryType) !== "String") return "'summaryType' is not string";
  if (getType(childItems) !== "Array") return "'childItems' not array";
  for (const summaryItem of childItems) {
    const { path, summary } = summaryItem;
    if (path === undefined)
      return ["summaryItem'path' is undefined", summaryItem];
    if (summary === undefined)
      return ["summaryItem 'summary' is undefined", summaryItem];
    // paths must be strings or path descriptions
    const pathIsString = getType(path) === "String";
    const pathIsRangeDesc = path.min !== undefined && path.max !== undefined;
    if (!(pathIsString || pathIsRangeDesc))
      return ["invalid 'path' in summaryItem", path, summary];
    // pathIsRangeDesc must have valid max/min numbers
    if (pathIsRangeDesc && (!isFinite(path.min) || !isFinite(path.max)))
      return ["invalid RangeDescriptor", path, summary];
    // the summary must be null or a valid summary
    const summaryIsNull = summary === null;
    const isValueSummaryObj =
      summary !== null &&
      (summary.objType !== undefined &&
        summary.size !== undefined &&
        summary.stringValue !== undefined &&
        summary.isTruncated !== undefined);
    if (!isValueSummaryObj && !summaryIsNull) {
      return ["invalid value summary", path, summary];
    }
    // if summary is null iff pathIsRangeDesc
    if (pathIsRangeDesc !== summaryIsNull)
      return ["failed pathIsRangeDesc IFF summaryIsNull", path, summary];
  }
  return true;
}
