import { shallow } from "enzyme";
import React from "react";

import {
  FixedPositionContainerUnconnected,
  mapStateToProps
} from "../fixed-position-container";

describe("FixedPositionContainerUnconnected React component", () => {
  let props;
  let mountedComponent;
  const childNode = <span>Hello</span>;

  const testComponent = () => {
    if (!mountedComponent) {
      mountedComponent = shallow(
        <FixedPositionContainerUnconnected {...props}>
          {childNode}
        </FixedPositionContainerUnconnected>
      );
    }
    return mountedComponent;
  };

  beforeEach(() => {
    props = {
      style: {
        display: "a string",
        top: 1,
        left: 2,
        width: 3,
        height: 4
      }
    };
    mountedComponent = undefined;
  });

  it("always renders a div", () => {
    expect(testComponent().find("div").length).toBe(1);
  });
});

describe("FixedPositionContainerUnconnected mapStateToProps", () => {
  let state;
  let ownProps;
  let pane1Style;

  beforeEach(() => {
    pane1Style = {
      display: "block",
      top: 1,
      left: 1,
      width: 1,
      height: 1
    };

    state = {
      panePositions: {
        PANE_1: pane1Style,
        PANE_2: {
          display: "block",
          top: 2,
          left: 2,
          width: 2,
          height: 2
        }
      }
    };
    ownProps = { paneId: "PANE_1" };
  });

  it("default case", () => {
    expect(mapStateToProps(state, ownProps)).toEqual({ style: pane1Style });
  });

  it("if hidden, should have display none", () => {
    ownProps.hidden = true;
    expect(mapStateToProps(state, ownProps).style.display).toEqual("none");
  });

  it("if fullscreen, should have display set to take fullscreen", () => {
    ownProps.fullscreen = true;
    expect(mapStateToProps(state, ownProps).style).toEqual({
      display: "block",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%"
    });
  });
});
