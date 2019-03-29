import React from "react";

import { shallow } from "enzyme";

import ValueRenderer from "../value-renderer";

import DefaultRenderer from "../default-handler";
import ErrorRenderer from "../error-handler";
import HTMLHandler from "../html-handler";
import UserReps from "../user-reps-manager";

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
      valueToRender: undefined
    };
    mountedItem = undefined;
  });

  [
    { type: "array", val: [1, 2, 3.4] },
    { type: "object", val: { a: 1, b: 2 } },
    { type: "number", val: 12345 },
    { type: "string", val: "foo" },
    { type: "null", val: null },
    { type: "undefined", val: undefined },
    { type: "function", val: () => 123 }
  ].forEach(testCase => {
    it(`render normal values with the DefaultRender (type: ${
      testCase.type
    })`, () => {
      props.valueToRender = testCase.val;
      expect(shallowValueRenderer().find(DefaultRenderer)).toHaveLength(1);
    });
  });

  it("handle errors with the ErrorRenderr", () => {
    props.valueToRender = new Error();
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
      valueToRender: undefined
    };
    mountedItem = undefined;
  });

  it("if there is applicable user output renderer, render with HTMLHandler with correct props (taking precedence over iodideRender method of value)", () => {
    props.valueToRender = { iodideRender: () => "iodideRender method" };
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
    props.valueToRender = { iodideRender: () => "iodideRender method" };
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

  it("adding iodideRender method to built in obj should cause HTMLHandler to be used with correct props", () => {
    props.valueToRender = [1, 2, 3, 4];
    props.valueToRender.iodideRender = () => "iodideRender method";
    expect(shallowValueRenderer().find(HTMLHandler)).toHaveLength(1);
    expect(
      shallowValueRenderer()
        .find(HTMLHandler)
        .prop("htmlString")
    ).toBe("iodideRender method");
  });
});
