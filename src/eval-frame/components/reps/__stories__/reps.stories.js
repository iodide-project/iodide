import React from "react";

import { storiesOf } from "@storybook/react";

// need to manually load css for react table
// but even with this some styles seem to be missing
import "../../../../../node_modules/react-table/react-table.css";

import {
  allCases,
  rowTableCases
} from "../__test_helpers__/reps-test-value-cases";
import {
  serializeForTinyRep,
  getClass,
  getType,
  objSize
} from "../rep-utils/tiny-rep-serializer";

import TinyRep from "../tiny-rep";

import ValueRenderer from "../value-renderer";

import TableRenderer from "../data-table-rep";

const allTinyReps = storiesOf("all test cases", module);
allTinyReps.add("table of type/class info", () => {
  return (
    <table>
      {Object.entries(allCases).map(caseNameAndVal => {
        const [name, value] = caseNameAndVal;
        return (
          <tr key={name}>
            <td>{name}</td>
            <td>{getType(value)}</td>
            <td>{getClass(value)}</td>
            <td>{objSize(value)}</td>
          </tr>
        );
      })}
    </table>
  );
});

allTinyReps.add("all the tiny reps", () => {
  return (
    <table>
      {Object.entries(allCases).map(caseNameAndVal => {
        const [name, value] = caseNameAndVal;
        return (
          <tr key={name}>
            <td>{name}</td>
            <td>
              <TinyRep serializedObj={serializeForTinyRep(value)} />
            </td>
            <td>{JSON.stringify(serializeForTinyRep(value))}</td>
          </tr>
        );
      })}
    </table>
  );
});

const tableRep = storiesOf("rowDf table rep", module);
tableRep.add("tables", () => {
  return (
    <div>
      {Object.entries(rowTableCases).map(caseNameAndVal => {
        const [name, value] = caseNameAndVal;
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
              <TableRenderer value={value} />
            </div>
          </div>
        );
      })}
    </div>
  );
});

const valueRendererStories = storiesOf("base ValueRenderer component", module);

Object.entries(allCases).forEach(caseNameAndVal => {
  const [name, value] = caseNameAndVal;
  valueRendererStories.add(name, () => <ValueRenderer valueToRender={value} />);
});
