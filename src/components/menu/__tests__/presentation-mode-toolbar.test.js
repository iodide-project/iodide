import React from "react";
import { shallow } from "enzyme";
import {
  PresentationModeToolbarUnconnected,
  mapStateToProps
} from "../presentation-mode-toolbar";
import ViewModeToggleButton from "../view-mode-toggle-button";

describe("PresentationModeToolbarUnconnected", () => {
  let mountedComponent;
  let props;

  const wrapper = () => {
    if (!mountedComponent) {
      mountedComponent = shallow(
        <PresentationModeToolbarUnconnected {...props} />
      );
    }
    return mountedComponent;
  };

  beforeEach(() => {
    props = {
      display: "property of display"
    };
    mountedComponent = undefined;
  });

  it("should render all children", () => {
    const display = ["block", "none"];
    display.forEach(value => {
      props.display = value;
      expect(wrapper().find(ViewModeToggleButton)).toHaveLength(1);
    });
  });
});

describe("PresentationModeToolbarUnconnected mapStateToProps", () => {
  let state;
  beforeEach(() => {
    state = { viewMode: "REPORT_VIEW" };
  });

  it("correct props if viewMode is REPORT_VIEW", () => {
    expect(mapStateToProps(state)).toEqual({
      display: "block"
    });
  });

  it("correct props if viewMode is not REPORT_VIEW", () => {
    state.viewMode = "not_REPORT_VIEW";
    expect(mapStateToProps(state)).toEqual({
      display: "none"
    });
  });
});
