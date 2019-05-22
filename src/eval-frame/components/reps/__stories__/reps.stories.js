import React from "react";

import { storiesOf } from "@storybook/react";

// need to manually load css for react table
// but even with this some styles seem to be missing
import "../../../../../node_modules/react-table/react-table.css";

import {
  allCases,
  rowTableCases
} from "../__test_helpers__/reps-test-value-cases";

// serializers
import {
  serializeForValueSummary,
  getClass,
  getType,
  objSize
} from "../rep-utils/value-summary-serializer";

import { serializeChildSummary } from "../rep-utils/child-summary-serializer";
import { getChildSummary } from "../rep-utils/get-child-summaries";

// components
import ValueSummary from "../value-summary";
import InlineChildSummary from "../in-line-child-summary";

import ExpandableRep from "../rep-tree";

// import ValueRenderer from "../value-renderer";

import TableRenderer from "../data-table-rep";

// attach the test cases to the window to allow comparing with browser devtools
window.allCases = allCases;

const headerStyle = { fontWeight: "bold", background: "#ddd" };

const allTestCases = storiesOf("all test cases", module);

allTestCases.add("table of type/class info", () => {
  return (
    <table>
      <thead style={headerStyle}>
        <tr key="header">
          <td>test case</td>
          <td>objType</td>
          <td>objClass</td>
          <td>size</td>
        </tr>
      </thead>
      <tbody>
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
      </tbody>
    </table>
  );
});

allTestCases.add("value summaries (tiny and full) and serializations", () => {
  return (
    <table>
      <tbody>
        <tr key="header" style={headerStyle}>
          <td>test case</td>
          <td>tiny ValueSummary</td>
          <td>full ValueSummary</td>
          <td>serialized ValueSummary</td>
        </tr>
        {Object.entries(allCases).map(caseNameAndVal => {
          const [name, value] = caseNameAndVal;
          const serializedValueSummary = serializeForValueSummary(value);
          return (
            <tr key={name}>
              <td>{name}</td>
              <td>
                <ValueSummary tiny {...serializedValueSummary} />
              </td>
              <td>
                <ValueSummary {...serializedValueSummary} />
              </td>
              <td>{JSON.stringify(serializedValueSummary)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});

allTestCases.add("child summary serializations", () => {
  return (
    <div style={{ maxWidth: "100%" }}>
      <table>
        {Object.entries(allCases).map(caseNameAndVal => {
          const [name, value] = caseNameAndVal;
          return (
            <tr key={name}>
              <td>{name}</td>
              <td>{JSON.stringify(serializeChildSummary(value))}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
});

allTestCases.add("inline child summary reps", () => {
  return (
    <div style={{ maxWidth: "100%" }}>
      <table>
        {Object.entries(allCases).map(caseNameAndVal => {
          const [name, value] = caseNameAndVal;
          return (
            <tr key={name}>
              <td>{name}</td>
              <td>
                <InlineChildSummary {...serializeChildSummary(value)} />
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
});

allTestCases.add("getChildSummary", () => {
  return (
    <div style={{ maxWidth: "100%" }}>
      <table>
        <thead style={headerStyle}>
          <tr key="header">
            <td>test case</td>
            <td>path</td>
            <td>childSummary</td>
          </tr>
        </thead>
        <tbody>
          {Object.entries(allCases).map(caseNameAndVal => {
            const [name, value] = caseNameAndVal;
            window[name] = value;
            const path0 = [name];
            const path1 = [name, "0"];
            return (
              <>
                <tr key={name}>
                  <td>{name}</td>
                  <td>{JSON.stringify(path0)}</td>
                  <td>{JSON.stringify(getChildSummary("window", path0))}</td>
                </tr>

                <tr key={`${name}-not-compact${1}`}>
                  <td>{name}</td>
                  <td>{JSON.stringify(path0)} - not compact</td>
                  <td>
                    {JSON.stringify(getChildSummary("window", path0, false))}
                  </td>
                </tr>
                <tr key={`${name}-path${1}`}>
                  <td>{name}</td>
                  <td>{JSON.stringify(path1)}</td>
                  <td>{JSON.stringify(getChildSummary("window", path1))}</td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

allTestCases.add("full rep", () => {
  return (
    <div style={{ maxWidth: "100%" }}>
      <table>
        <thead style={headerStyle}>
          <tr key="header">
            <td>test case</td>
            <td>rep</td>
            {/* <td>getChildSummaries summary</td> */}
          </tr>
        </thead>
        <tbody>
          {Object.entries(rowTableCases).map(caseNameAndVal => {
            const [name, value] = caseNameAndVal;
            const serializedValueSummary = serializeForValueSummary(
              window[name]
            );
            console.log("serializedValueSummary", serializedValueSummary);
            return (
              <tr key={name}>
                <td>{name}</td>
                <td>
                  <ExpandableRep
                    pathToEntity={[name]}
                    valueSummary={serializedValueSummary}
                    getChildSummaries={getChildSummary}
                    rootObjName="window"
                  />
                </td>
                {/* <td>
                  {JSON.stringify(getChildSummary("window", [name], false))}
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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

// const valueRendererStories = storiesOf("base ValueRenderer component", module);

// Object.entries(allCases).forEach(caseNameAndVal => {
//   const [name, value] = caseNameAndVal;
//   valueRendererStories.add(name, () => <ValueRenderer valueToRender={value} />);
// });
