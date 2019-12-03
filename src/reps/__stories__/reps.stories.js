import React from "react";

import { storiesOf } from "@storybook/react";

// need to manually load css for react table
// but even with this some styles seem to be missing
import "../../../node_modules/react-table/react-table.css";

// serializers
import {
  serializeForValueSummary,
  getClass,
  getType,
  objSize
} from "../serialization/value-summary-serializer";

import { serializeChildSummary } from "../serialization/child-summary-serializer";
import { getChildSummary } from "../serialization/get-child-summaries";

// components
import ValueSummary from "../components/value-summary";
import InlineChildSummary from "../components/in-line-child-summary";

import ExpandableRep from "../components/rep-tree";

import { allCases } from "../__test_helpers__/reps-test-value-cases";

// attach the test cases to the window to allow comparing with browser devtools
window.allCases = allCases;

const headerStyle = { fontWeight: "bold", background: "#ddd" };

const allTestCases = storiesOf("reps test cases", module);

allTestCases.add("table of type/class info", () => {
  return (
    <table>
      <thead style={headerStyle}>
        <tr key="header">
          <td>test case</td>
          <td>objType</td>
          <td>objClass</td>
          <td>size</td>
          <td>js toString value</td>
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
              <td>{Object().toString.call(value)}</td>
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
        <tbody>
          {Object.entries(allCases).map(caseNameAndVal => {
            const [name, value] = caseNameAndVal;
            return (
              <tr key={name}>
                <td>{name}</td>
                <td>{JSON.stringify(serializeChildSummary(value))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

allTestCases.add("inline child summary reps", () => {
  return (
    <div style={{ maxWidth: "100%" }}>
      <table>
        <tbody>
          {Object.entries(allCases).map(caseNameAndVal => {
            const [name, value] = caseNameAndVal;
            const parentType = serializeForValueSummary(value).objType;
            return (
              <tr key={name}>
                <td>{name}</td>
                <td>
                  <InlineChildSummary
                    parentType={parentType}
                    childSummaries={serializeChildSummary(value)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
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
            return (
              <>
                <tr key={name}>
                  <td>{name}</td>
                  <td>{JSON.stringify([name])}</td>
                  <td>{JSON.stringify(getChildSummary("window", [name]))}</td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

window.STORYBOOK_TEST_CASES = {};

allTestCases.add("expandable rep", () => {
  return (
    <div style={{ maxWidth: "100%" }}>
      <table style={{ borderSpacing: "0 15px" }}>
        <thead style={headerStyle}>
          <tr key="header">
            <td>test case</td>
            <td>rep</td>
          </tr>
        </thead>
        <tbody>
          {Object.entries(allCases).map(caseNameAndVal => {
            const [name, value] = caseNameAndVal;
            window.STORYBOOK_TEST_CASES[name] = value;
            const serializedValueSummary = serializeForValueSummary(
              window.STORYBOOK_TEST_CASES[name]
            );
            return (
              <tr key={name}>
                <td>{name}</td>
                <td>
                  <ExpandableRep
                    pathToEntity={[name]}
                    valueSummary={serializedValueSummary}
                    getChildSummaries={path => getChildSummary("window", path)}
                    rootObjName="STORYBOOK_TEST_CASES"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
