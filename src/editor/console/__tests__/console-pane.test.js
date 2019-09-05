import { shallow } from "enzyme";
import React from "react";

import HistoryItem from "../history/components/history-item";

import { ConsolePaneUnconnected, mapStateToProps } from "../console-pane";
import OnboardingContent from "../../../shared/components/onboarding-content";

describe("ConsolePaneUnconnected React component", () => {
  let props;
  let mountedPane;

  const consolePane = () => {
    if (!mountedPane) {
      mountedPane = shallow(<ConsolePaneUnconnected {...props} />);
    }
    return mountedPane;
  };

  beforeEach(() => {
    props = {
      historyIds: ["a"],
      paneVisible: true
    };

    mountedPane = undefined;
  });

  it("always renders one div with class history-items", () => {
    expect(consolePane().find("div.history-items")).toHaveLength(1);
  });

  it("always renders one OnboardingContent inside history-items when history is empty", () => {
    props.historyIds = [];
    expect(consolePane().find(OnboardingContent)).toHaveLength(1);
  });

  it("always renders HistoryItem inside history-items when history is non empty", () => {
    expect(
      consolePane()
        .find("div.history-items")
        .find(HistoryItem)
    ).toHaveLength(1);
  });

  it("always renders correct number of HistoryItem inside history-items", () => {
    props.historyIds = ["a", "b", "c"];
    expect(
      consolePane()
        .find("div.history-items")
        .find(HistoryItem)
    ).toHaveLength(3);
  });
});

describe("HistoryPane mapStateToProps", () => {
  let state;

  beforeEach(() => {
    state = {
      history: [{ historyId: "1" }, { historyId: "2" }],
      panePositions: { ConsolePositioner: { display: "block" } }
    };
  });

  it("correct historyIds", () => {
    expect(mapStateToProps(state).historyIds).toEqual(["1", "2"]);
  });

  it('paneVisible===true if state.panePositions.ConsolePositioner.display==="block"', () => {
    expect(mapStateToProps(state).paneVisible).toEqual(true);
  });

  it('paneVisible===true if state.panePositions.ConsolePositioner.display!=="block"', () => {
    state.panePositions.ConsolePositioner.display = "NOT_block";
    expect(mapStateToProps(state).paneVisible).toEqual(false);
  });
});
