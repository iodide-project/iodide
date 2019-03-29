import { shallow } from "enzyme";
import React from "react";

import { DeclaredVariable } from "../declared-variable";
import ValueRenderer from "../../reps/value-renderer";

describe("DeclaredVariable React component", () => {
  let props;
  let mountedVariable;

  const declaredVariable = () => {
    if (!mountedVariable) {
      mountedVariable = shallow(<DeclaredVariable {...props} />);
    }
    return mountedVariable;
  };

  beforeEach(() => {
    props = {
      value: 3,
      varName: "a"
    };
    mountedVariable = undefined;
  });

  it("always renders one div with class declared-variable", () => {
    expect(declaredVariable().find("div.declared-variable").length).toBe(1);
  });

  it("always renders one div with class declared-variable-name inside declared-variable", () => {
    expect(
      declaredVariable()
        .wrap(declaredVariable().find("div.declared-variable"))
        .find("div.declared-variable-name")
    ).toHaveLength(1);
  });

  it("always renders one div with class declared-variable-value inside declared-variable", () => {
    expect(
      declaredVariable()
        .wrap(declaredVariable().find("div.declared-variable"))
        .find("div.declared-variable-value")
    ).toHaveLength(1);
  });

  it("always renders one ValueRenderer inside declared-variable-value", () => {
    expect(
      declaredVariable()
        .wrap(declaredVariable().find("div.declared-variable-value"))
        .find(ValueRenderer)
    ).toHaveLength(1);
  });

  it("sets the ValueRenderer's valueToRender prop to be declared variable's value prop", () => {
    expect(
      declaredVariable()
        .find(ValueRenderer)
        .props().valueToRender
    ).toBe(props.value);
  });
});
