/* eslint-disable import/no-named-as-default */
import React from "react";
import { shallow } from "enzyme";
import {
  EditorModeToolbarUnconnected,
  mapStateToProps
} from "../editor-mode-toolbar";
import Header from "../../../../shared/components/header/header";
import EditorModeTitle from "../editor-mode-title";
import ViewControls from "../view-controls";
import IodideLogo from "../../../../shared/components/iodide-logo";
import EditorModeControls from "../editor-mode-controls";

describe("EditorModeToolbarUnconnected", () => {
  let mountedComponent;
  let props;
  const wrapper = () => {
    if (!mountedComponent) {
      mountedComponent = shallow(<EditorModeToolbarUnconnected {...props} />);
    }
    return mountedComponent;
  };
  beforeEach(() => {
    props = {
      viewModeStyle: {}
    };
    mountedComponent = undefined;
  });

  it("should render all child components correctly", () => {
    //                 PRESENTATION        EXPLORE
    const viewMode = [{ display: "none" }, {}];
    viewMode.forEach(value => {
      props.viewModeStyle = value;
      expect(wrapper().find(EditorModeTitle)).toHaveLength(1);
      expect(wrapper().find(ViewControls)).toHaveLength(1);
      expect(wrapper().find(IodideLogo)).toHaveLength(1);
      expect(wrapper().find(EditorModeControls)).toHaveLength(1);
    });
  });
  it("should have display none when viewMode !== EXPLORE_VIEW", () => {
    props.viewModeStyle = { display: "none" };
    const div = wrapper().find(Header);
    const divStyle = div.get(0).props.style;
    expect(divStyle).toHaveProperty("display", "none");
  });
  it("should have display block when viewMode == EXPLORE_VIEW", () => {
    const div = wrapper().find(Header);
    const divStyle = div.get(0).props.style;
    expect(divStyle).toEqual({});
  });
});

describe("EditorModeToolbarUnconnected mapStateToProps", () => {
  let state;
  beforeEach(() => {
    state = {
      notebookInfo: {
        connectionMode: "SERVER"
      }
    };
  });

  it("backLink == / if state.notebookInfo.connectionMode is server", () => {
    expect(mapStateToProps(state).backLink).toEqual("/");
  });
  it("backLink == false if state.notebookInfo.connectionMode is not server", () => {
    state.notebookInfo.connectionMode = "";
    expect(mapStateToProps(state).backLink).toEqual(false);
  });
});
