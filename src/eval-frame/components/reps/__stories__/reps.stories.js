import React from "react";

import { storiesOf } from "@storybook/react";

import "../../../../../node_modules/react-table/react-table.css";

import {
  allCases,
  rowTableCases
} from "../__test_helpers__/reps-test-value-cases";
import {
  tinyRepSerializer,
  getClass,
  getType,
  objSize
} from "../rep-utils/tiny-rep-serializer";

import tinyRep from "../tiny-reps";

import TableRenderer from "../data-table-rep";

const allTinyReps = storiesOf("all test cases", module);
allTinyReps.add("type/class info", () => {
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
            <td>{tinyRep(tinyRepSerializer(value))}</td>
            <td>{JSON.stringify(tinyRepSerializer(value))}</td>
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
          <div key={name}>
            <div>{name}</div>
            <TableRenderer value={value} />
          </div>
        );
      })}
    </div>
  );
});
