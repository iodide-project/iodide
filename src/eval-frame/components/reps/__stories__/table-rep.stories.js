import React from "react";

import { storiesOf } from "@storybook/react";

// need to manually load css for react table
// but even with this some styles seem to be missing
import "../../../../../node_modules/react-table/react-table.css";

import { rowTableCases } from "../__test_helpers__/reps-test-value-cases";

import { getInitialDataTableSummary } from "../rep-utils/get-data-table-summary";

import TableRenderer from "../data-table-rep";

const tableRep = storiesOf("rowDf table rep", module);

const storyRootObjName = "ROW_TABLE_TEST_CASES";
window[storyRootObjName] = {};

tableRep.add("tables", () => {
  return (
    <div>
      {Object.entries(rowTableCases).map(caseNameAndVal => {
        const [name, value] = caseNameAndVal;
        window[storyRootObjName][name] = value;
        const path = [name];
        const { rows, pages } = getInitialDataTableSummary(
          storyRootObjName,
          path
        );
        return (
          <div key={name} style={{ padding: "10px", display: "grid" }}>
            <div style={{ padding: "10px 10px" }}>case: {name}</div>
            <div
              style={{
                margin: "auto",
                marginLeft: "0",
                maxWidth: "calc(100% - 5px)",
                overflowX: "auto"
              }}
            >
              <TableRenderer
                initialDataRows={rows}
                pages={pages}
                pathToDataFrame={path}
                rootObjName={storyRootObjName}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
});
