import { shallow } from "enzyme";
import React from "react";

import { LayoutManagerUnconnected, mapStateToProps } from "../layout-manager";
import {
  LAYOUT_MANAGER_IN_FRONT_ZINDEX,
  LAYOUT_MANAGER_IN_BACK_ZINDEX
} from "../../../style/z-index-styles";

describe("LayoutManagerUnconnected React component", () => {
  let props;
  let mountedComponent;
  const childNode = <span>Hello</span>;

  const testComponent = () => {
    if (!mountedComponent) {
      mountedComponent = shallow(
        <LayoutManagerUnconnected {...props}>
          {childNode}
        </LayoutManagerUnconnected>
      );
    }
    return mountedComponent;
  };

  beforeEach(() => {
    props = { zIndex: 10, updateLayoutPositions: jest.fn() };
  });

  it("always renders a div", () => {
    expect(testComponent().find("div").length).toBe(1);
  });
});

describe("LayoutManagerUnconnected mapStateToProps", () => {
  let state;
  beforeEach(() => {
    state = {
      viewMode: "REPORT_VIEW"
    };
  });

  it("in REPORT_VIEW, z-index set correctly", () => {
    expect(mapStateToProps(state).zIndex).toEqual(
      LAYOUT_MANAGER_IN_BACK_ZINDEX
    );
  });

  it("if NOT in REPORT_VIEW, z-index set correctly", () => {
    state.viewMode = "NOT_REPORT";
    expect(mapStateToProps(state).zIndex).toEqual(
      LAYOUT_MANAGER_IN_FRONT_ZINDEX
    );
  });
});
