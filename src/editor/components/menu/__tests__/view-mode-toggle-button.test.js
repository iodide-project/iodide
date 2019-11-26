import React from "react";
import { shallow } from "enzyme";
import Button from "@material-ui/core/Button";
import {
  ViewModeToggleButtonUnconnected,
  mapStateToProps
} from "../view-mode-toggle-button";

describe("ViewModeToggleButtonUnconnected", () => {
  let mountedComponent;
  let props;
  let setViewModeToExploreMock;
  let setViewModeToReportMock;

  const wrapper = () => {
    if (!mountedComponent) {
      mountedComponent = shallow(
        <ViewModeToggleButtonUnconnected {...props} />
      );
    }
    return mountedComponent;
  };

  beforeEach(() => {
    setViewModeToExploreMock = jest.fn();
    setViewModeToReportMock = jest.fn();
    props = {
      isReportView: true,
      buttonText: "a button text string",
      setViewModeToExplore: setViewModeToExploreMock,
      setViewModeToReport: setViewModeToReportMock,
      style: { button: "a object for styling button" },
      tooltipText: "tooltip_text"
    };
    mountedComponent = undefined;
  });

  it("correct function called when isReportView===true", () => {
    wrapper()
      .find(Button)
      .simulate("click");
    expect(setViewModeToExploreMock).toHaveBeenCalled();
    expect(setViewModeToReportMock).not.toHaveBeenCalled();
  });

  it("correct function called when isReportView===false", () => {
    props.isReportView = false;
    wrapper()
      .find(Button)
      .simulate("click");
    expect(setViewModeToExploreMock).not.toHaveBeenCalled();
    expect(setViewModeToReportMock).toHaveBeenCalled();
  });
});

describe("ViewModeToggleButton mapStateToProps", () => {
  let state;
  beforeEach(() => {
    state = { viewMode: "REPORT_VIEW" };
  });

  it("correct props if REPORT_VIEW", () => {
    expect(mapStateToProps(state)).toEqual({
      isReportView: true,
      buttonText: "Explore",
      tooltipText: "Explore this notebook",
      style: {
        backgroundColor: "#eee",
        border: "1px solid #ccc",
        color: "black"
      }
    });
  });

  it("correct props if not REPORT_VIEW", () => {
    state.viewMode = "not_REPORT_VIEW";
    expect(mapStateToProps(state)).toEqual({
      isReportView: false,
      buttonText: "View as Report",
      tooltipText: "Go to Report view",
      style: { color: "#fafafa" }
    });
  });
});
