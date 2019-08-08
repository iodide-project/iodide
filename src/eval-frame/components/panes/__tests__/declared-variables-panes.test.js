import { shallow } from "enzyme";
import React from "react";

import { DeclaredVariable } from "../declared-variable";

import {
  DeclaredVariablesPaneUnconnected,
  mapStateToProps
} from "../declared-variables-pane";

describe("DeclaredVariablesPaneUnconnected React component", () => {
  let props;
  let nextProps;
  let mountedPane;

  const declaredVariablesPane = () => {
    if (!mountedPane) {
      mountedPane = shallow(<DeclaredVariablesPaneUnconnected {...props} />);
    }
    return mountedPane;
  };

  beforeEach(() => {
    props = {
      userDefinedVarNames: ["iodide", "a", "b"],
      paneVisible: true
    };
    nextProps = {
      userDefinedVarNames: ["iodide", "a", "b"],
      paneVisible: true
    };
    mountedPane = undefined;
  });

  it("always renders one SidePane", () => {
    expect(declaredVariablesPane().find("div.pane-content").length).toBe(1);
  });

  it("always renders correct number of DeclaredVariable", () => {
    expect(declaredVariablesPane().find(DeclaredVariable)).toHaveLength(3);
  });

  it("never renders DeclaredVariable when userDefinedVarNames is empty", () => {
    props.userDefinedVarNames = [];
    expect(declaredVariablesPane().find(DeclaredVariable)).toHaveLength(0);
  });

  it("updates the component when props change and paneVisible===true", () => {
    nextProps.userDefinedVarNames = ["iodide", "a", "b", "foo"];
    expect(
      declaredVariablesPane()
        .instance()
        .shouldComponentUpdate(nextProps)
    ).toBe(true);
  });

  it("never updates the component when props===nextProps", () => {
    expect(props).toEqual(nextProps);
    expect(
      declaredVariablesPane()
        .instance()
        .shouldComponentUpdate(nextProps)
    ).toBe(false);
  });

  it("never updates the component when neither of props & nextProps have paneVisible==true", () => {
    nextProps.userDefinedVarNames = ["iodide", "a", "b", "foo"];
    props.paneVisible = false;
    nextProps.paneVisible = false;
    expect(
      declaredVariablesPane()
        .instance()
        .shouldComponentUpdate(nextProps)
    ).toBe(false);
  });

  it("DO updates the component if just props has paneVisible==true", () => {
    nextProps.userDefinedVarNames = ["iodide", "a", "b", "foo"];
    props.paneVisible = true;
    nextProps.paneVisible = false;
    expect(
      declaredVariablesPane()
        .instance()
        .shouldComponentUpdate(nextProps)
    ).toBe(true);
  });

  it("DO updates the component if just nextProps has paneVisible==true", () => {
    nextProps.userDefinedVarNames = ["iodide", "a", "b", "foo"];
    props.paneVisible = false;
    nextProps.paneVisible = true;
    expect(
      declaredVariablesPane()
        .instance()
        .shouldComponentUpdate(nextProps)
    ).toBe(true);
  });
});

describe("DeclaredVariablesPane mapStateToProps", () => {
  let state;

  beforeEach(() => {
    state = {
      userDefinedVarNames: ["iodide", "a"],
      panePositions: { WorkspacePositioner: { display: "block" } }
    };
  });

  it("should return the correct basic info", () => {
    expect(mapStateToProps(state)).toEqual({
      userDefinedVarNames: ["iodide", "a"],
      paneVisible: true
    });
  });

  it('paneVisible===false if state.panePositions.WorkspacePositioner.display!=="block"', () => {
    state.panePositions.WorkspacePositioner.display = "NOT_block";
    expect(mapStateToProps(state).paneVisible).toEqual(false);
  });
});
