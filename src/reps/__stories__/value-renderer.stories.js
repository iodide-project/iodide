import React from "react";

import { storiesOf } from "@storybook/react";

// need to manually load css for react table
// but even with this some styles seem to be missing
import "../../../node_modules/react-table/react-table.css";

import { allCases } from "../__test_helpers__/reps-test-value-cases";

import { ValueRendererUnconnected } from "../components/value-renderer";
import { makeValueRendererWithRepRequest } from "../components/rep-info-requestor";
import { repInfoRequestResponse } from "../serialization/rep-info-request-response";

const mockUserRenderManager = {
  getUserRepIfAvailable: value => {
    if (value && value.useCustomRep === "do it") {
      return "<p>this is a custom renderer<p>";
    }
    return null;
  }
};

export function repInfoRequestResponseWithMockUserReps(payload) {
  return repInfoRequestResponse(payload, {
    userRepManager: mockUserRenderManager
  });
}

const ValueRenderer = makeValueRendererWithRepRequest(
  ValueRendererUnconnected,
  repInfoRequestResponseWithMockUserReps,
  "window"
);

const valueRendererStories = storiesOf("base ValueRenderer component", module);

Object.entries(allCases).forEach(caseNameAndVal => {
  const [name, value] = caseNameAndVal;
  window[name] = value;
  valueRendererStories.add(name, () => <ValueRenderer valueKey={name} />);
});
