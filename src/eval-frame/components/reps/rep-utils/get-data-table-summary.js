import { range } from "lodash";
import { getValueSummary } from "./get-value-summary";

import { getObjAtPath } from "./get-child-summaries";

// serializeChildSummary(getObjAtPath(window[rootObjName], path));

export function getDataTableSummary(rootObjName, path, pageSize, page) {
  const tabularObj = getObjAtPath(window[rootObjName], path);

  // // You can also use the sorting in your request, but again, you are responsible for applying it.
  // const sortedData = _.orderBy(
  //   tabularObj,
  //   sorted.map(sort => {
  //     return row => {
  //       if (row[sort.id] === null || row[sort.id] === undefined) {
  //         return -Infinity;
  //       }
  //       return typeof row[sort.id] === "string"
  //         ? row[sort.id].toLowerCase()
  //         : row[sort.id];
  //     };
  //   }),
  //   sorted.map(d => (d.desc ? "desc" : "asc"))
  // );

  // You must return an object containing the rows of the current page, and optionally the total pages number.
  // const rows = tabularObj

  const colNames = Object.keys(tabularObj[0]);

  const rows = range(pageSize * page, pageSize * page + pageSize).map(row => {
    const thisRow = {};
    colNames.forEach(col => {
      const thisPath = [...path, String(row), col];
      thisRow[col] = getValueSummary(rootObjName, thisPath);
    });
    return thisRow;
  });

  return {
    rows,
    pages: Math.ceil(tabularObj.length / pageSize)
  };
}

export function getInitialDataTableSummary(rootObjName, path) {
  return getDataTableSummary(rootObjName, path, 10, 0);
}
