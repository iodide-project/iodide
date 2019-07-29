import React from "react";

import { storiesOf } from "@storybook/react";

// need to manually load css for react table
// but even with this some styles seem to be missing
import "../../../../../node_modules/react-table/react-table.css";

import { allCases } from "../__test_helpers__/reps-test-value-cases";

import ValueRenderer from "../value-renderer";

const valueRendererStories = storiesOf("base ValueRenderer component", module);

Object.entries(allCases).forEach(caseNameAndVal => {
  const [name, value] = caseNameAndVal;
  window[name] = value;
  valueRendererStories.add(name, () => (
    <ValueRenderer windowValue valueKey={name} />
  ));
});
