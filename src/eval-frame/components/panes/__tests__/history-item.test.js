import { shallow } from "enzyme";
import React from "react";

// FIXME this is an ugly hack to make tests pass without errors;
// importing the store initializes it before other files, pre-empting
// errors that actually result from circular dependencies
import { store } from "../../../store"; /* eslint-disable-line no-unused-vars */

import HistoryItem from "../history-item";

describe("HistoryItem React component", () => {
  let props;
  let mountedItem;

  const historyItem = () => {
    if (!mountedItem) {
      mountedItem = shallow(<HistoryItem {...props} />);
    }
    return mountedItem;
  };

  beforeEach(() => {
    props = {
      cell: {
        cellId: 0,
        display: true,
        lastRan: 1533078293981,
        content: "var a = 3"
      },
      display: true
    };
    mountedItem = undefined;
  });

  it.skip("always renders one div with correct class", () => {
    expect(historyItem().find("div.cell-history-container").length).toBe(1);
  });

  it.skip("always renders div with correct class when display is false", () => {
    props.display = false;
    expect(
      historyItem()
        .find("div.cell-history-container")
        .hasClass("hidden-cell")
    ).toBe(true);
  });

  it.skip("always renders div with correct class when display is true", () => {
    props.display = true;
    expect(
      historyItem()
        .find("div.cell-history-container")
        .hasClass("hidden-cell")
    ).toBe(false);
  });

  it.skip("always renders one div with classes cell and history-cell", () => {
    expect(historyItem().find("div.cell.history-cell").length).toBe(1);
  });

  it.skip("always renders one div with class history-content inside history-cell", () => {
    expect(
      historyItem()
        .wrap(historyItem().find("div.history-cell"))
        .find("div.history-content")
    ).toHaveLength(1);
  });
  it.skip("always renders one pre inside history-content", () => {
    expect(historyItem().find("pre.history-item-code")).toHaveLength(1);
  });
});
