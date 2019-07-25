import React from "react";

import { storiesOf } from "@storybook/react";

import { rowTableCases } from "../__test_helpers__/reps-test-value-cases";

import { getInitialDataTableSummary } from "../serialization/get-data-table-summary";

import { repInfoRequestResponse } from "../serialization/rep-info-request-response";
import TableRenderer from "../components/data-table-rep";

const tableRep = storiesOf("rowDf table rep", module);

const storyRootObjName = "ROW_TABLE_TEST_CASES";
window[storyRootObjName] = {};

function requestRepInfoFromRootObj(requestObj) {
  return repInfoRequestResponse(
    Object.assign({ rootObjName: storyRootObjName }, requestObj)
  );
}

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
                requestRepInfo={requestRepInfoFromRootObj}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
});
