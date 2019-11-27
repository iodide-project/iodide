import { serializeForValueSummary } from "./value-summary-serializer";

import { getObjAtPath } from "./get-child-summaries";

function orderUnequalVals(a, b, desc) {
  let order;
  // sort undefined after null,
  // and both undefined and null after anything else
  if (a === undefined && b === null) {
    order = -1;
  } else if (a === null && b === undefined) {
    order = 1;
  } else if (a === null || a === undefined) {
    order = 1;
  } else if (b === null || b === undefined) {
    order = -1;
  } else {
    const a1 = typeof a === "string" ? a.toLowerCase() : a;
    const b1 = typeof b === "string" ? b.toLowerCase() : b;
    order = a1 < b1 ? -1 : 1;
  }
  return desc ? -order : order;
}

export function getDataTableSummary(rootObjName, path, pageSize, page, sorted) {
  const tabularObj = getObjAtPath(
    window[rootObjName],
    path
  ).map((row, rowNum) => ({ row, rowNum }));
  const colNames = Object.keys(tabularObj[0].row);

  let sortedData;

  // FIXME: with a little work we could implement a single pass
  // O(n*k*log(k)) algorithm for extracting k items from the list
  if (sorted && sorted.length) {
    sortedData = tabularObj.sort((iRowA, iRowB) => {
      for (const sort of sorted) {
        if (iRowA.row[sort.id] !== iRowB.row[sort.id]) {
          return orderUnequalVals(
            iRowA.row[sort.id],
            iRowB.row[sort.id],
            sort.desc
          );
        }
      }
      return 0;
    });
  } else {
    sortedData = tabularObj;
  }

  const maxIndex = Math.min(pageSize * page + pageSize, tabularObj.length);

  const rows = sortedData
    .slice(pageSize * page, maxIndex)
    .map(({ row, rowNum }) => {
      const thisRow = {};
      thisRow.ORIGINAL_DATA_TABLE_ROW_INDEX = rowNum;
      colNames.forEach(col => {
        thisRow[col] = serializeForValueSummary(row[col]);
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
