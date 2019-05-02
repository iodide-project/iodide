import { shallow } from "enzyme";
import React from "react";

// FIXME this is an ugly hack to make tests pass without errors;
// importing the store initializes it before other files, pre-empting
// errors that actually result from circular dependencies
import { store } from "../../../store"; /* eslint-disable-line no-unused-vars */

import HistoryItem from "../history-item";

import { ConsolePaneUnconnected, mapStateToProps } from "../console-pane";
import OnboardingContent from "../../../../shared/components/onboarding-content";

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
      history: [
        {
          cellId: 0,
          content: "var a = 3"
        }
      ],
      paneVisible: true
    };

    mountedPane = undefined;
  });

  it("always renders one div with class history-items", () => {
    expect(consolePane().find("div.history-items")).toHaveLength(1);
  });
  // rewrite this test.

  it("always renders one OnboardingContent inside history-items when history is empty", () => {
    props.history = [];
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
    props.history = [
      {
        cellId: 0,
        content: "var a = 3"
      },
      {
        cellId: 1,
        content: "var b = 3"
      }
    ];

    expect(
      consolePane()
        .find("div.history-items")
        .find(HistoryItem)
    ).toHaveLength(2);
  });
});

describe("HistoryPane mapStateToProps", () => {
  let state;

  beforeEach(() => {
    state = {
      history: [
        {
          cellId: 0,
          content: "var a = 3"
        }
      ],
      panePositions: { ConsolePositioner: { display: "block" } }
    };
  });

  it('paneVisible===true if state.panePositions.ConsolePositioner.display==="block"', () => {
    expect(mapStateToProps(state).paneVisible).toEqual(true);
  });

  it('paneVisible===true if state.panePositions.ConsolePositioner.display!=="block"', () => {
    state.panePositions.ConsolePositioner.display = "NOT_block";
    expect(mapStateToProps(state).paneVisible).toEqual(false);
  });
});
