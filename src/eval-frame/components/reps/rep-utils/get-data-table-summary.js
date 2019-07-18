import { range } from "lodash";
import { getValueSummary } from "./get-value-summary";

import { getObjAtPath } from "./get-child-summaries";

export function getDataTableSummary(rootObjName, path, pageSize, page) {
  const tabularObj = getObjAtPath(window[rootObjName], path);

  // // FIXME: we may wish to consider making the tables sortable
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

  const colNames = Object.keys(tabularObj[0]);
  const maxIndex = Math.min(pageSize * page + pageSize, tabularObj.length);
  const rows = range(pageSize * page, maxIndex).map(row => {
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
