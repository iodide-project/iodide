import React from "react";

import { shallow } from "enzyme";

import ValueRenderer from "../value-renderer";

import ExpandableRep from "../rep-tree";
import ErrorRenderer from "../error-handler";
import HTMLHandler from "../html-handler";
import UserReps from "../user-reps-manager";

import { IODIDE_EVALUATION_RESULTS } from "../../../iodide-evaluation-results";

const simpleTestCases = [
  { type: "array", val: [1, 2, 3.4] },
  { type: "object", val: { a: 1, b: 2 } },
  { type: "number", val: 12345 },
  { type: "string", val: "foo" },
  { type: "null", val: null },
  { type: "undefined", val: undefined },
  { type: "function", val: () => 123 }
];

simpleTestCases.forEach((testCase, i) => {
  IODIDE_EVALUATION_RESULTS[`result_${i}`] = testCase.val;
});

describe("ValueRenderer React component, handling normal types without custom rendering", () => {
  let props;
  let mountedItem;

  const shallowValueRenderer = () => {
    if (!mountedItem) {
      mountedItem = shallow(<ValueRenderer {...props} />);
    }
    return mountedItem;
  };

  beforeEach(() => {
    UserReps.clearRenderers();
    props = {
      valueKey: undefined
    };
    mountedItem = undefined;
  });

  simpleTestCases.forEach((testCase, i) => {
    it(`render normal values with the DefaultRender (type: ${testCase.type})`, () => {
      props.valueKey = `result_${i}`;
      expect(shallowValueRenderer().find(ExpandableRep)).toHaveLength(1);
    });
  });

  it("handle errors with the ErrorRenderr", () => {
    IODIDE_EVALUATION_RESULTS.error_result = new Error();
    props.valueKey = "error_result";
    expect(shallowValueRenderer().find(ErrorRenderer)).toHaveLength(1);
  });
});

describe("ValueRenderer React component, handling custom renderers", () => {
  let props;
  let mountedItem;

  const shallowValueRenderer = () => {
    if (!mountedItem) {
      mountedItem = shallow(<ValueRenderer {...props} />);
    }
    return mountedItem;
  };

  beforeEach(() => {
    UserReps.clearRenderers();
    props = {
      valueKey: "test_result"
    };
    mountedItem = undefined;
    Object.keys(IODIDE_EVALUATION_RESULTS).forEach(k => {
      delete IODIDE_EVALUATION_RESULTS[k];
    });
  });

  it("if there is applicable user output renderer, render with HTMLHandler with correct props (taking precedence over iodideRender method of value)", () => {
    IODIDE_EVALUATION_RESULTS.test_result = {
      iodideRender: () => "iodideRender method"
    };

    UserReps.addRenderer({
      shouldRender: () => true,
      render: () => "userReps render fn"
    });

    expect(shallowValueRenderer().find(HTMLHandler)).toHaveLength(1);
    expect(
      shallowValueRenderer()
        .find(HTMLHandler)
        .prop("htmlString")
    ).toBe("userReps render fn");
  });

  it("if there is iodideRender method but no applicable user output renderer, render with HTMLHandler with correct props", () => {
    IODIDE_EVALUATION_RESULTS.test_result = {
      iodideRender: () => "iodideRender method"
    };
    UserReps.addRenderer({
      shouldRender: () => false,
      render: () => "userReps render fn"
    });

    expect(shallowValueRenderer().find(HTMLHandler)).toHaveLength(1);
    expect(
      shallowValueRenderer()
        .find(HTMLHandler)
        .prop("htmlString")
    ).toBe("iodideRender method");
  });

  it("result with iodideRender method should use HTMLHandler to be used with correct props", () => {
    IODIDE_EVALUATION_RESULTS.test_result = {
      iodideRender: () => "iodideRender method"
    };

    expect(shallowValueRenderer().find(HTMLHandler)).toHaveLength(1);
    expect(
      shallowValueRenderer()
        .find(HTMLHandler)
        .prop("htmlString")
    ).toBe("iodideRender method");
  });
});
