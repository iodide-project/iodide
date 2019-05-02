import { shallow } from "enzyme";
import React from "react";

import { HistoryItemUnconnected } from "../history-item";
import HistoryInputItem from "../console/history-input-item";
import AppMessage from "../console/app-message";
import ConsoleMessage from "../console/console-message";
import ValueRenderer from "../../reps/value-renderer";
import PreformattedTextItemsHandler from "../../reps/preformatted-text-items-handler";

describe("HistoryItem React component", () => {
  const historyItem = props => {
    return shallow(<HistoryItemUnconnected {...props} />);
  };

  it("always renders the APP_MESSAGE as an AppMessage component", () => {
    // generate shallowRender.
    const hist = historyItem({
      historyType: "APP_MESSAGE",
      historyId: "123456asdfg",
      content: "NOTEBOOK_SAVED"
    });
    expect(hist.find(AppMessage).length).toBe(1);
  });
  it("always renders the CONSOLE_MESSAGE as an ConsoleMessage component", () => {
    const hist = historyItem({
      historyType: "CONSOLE_MESSAGE",
      historyId: "123456asdfg",
      level: "WARN",
      content: "var x = 10"
    });
    expect(hist.find(ConsoleMessage).length).toBe(1);
  });
  it("always renders the CONSOLE_INPUT as an HistoryInputItem component", () => {
    const hist = historyItem({
      historyType: "CONSOLE_INPUT",
      historyId: "123456asdfg",
      content: "var x = 10",
      language: "js"
    });
    expect(hist.find(HistoryInputItem).length).toBe(1);
  });
  it("always renders the CONSOLE_OUTPUT as an ConsoleMessage component with a ValueRenderer in it", () => {
    const hist = historyItem({
      historyType: "CONSOLE_OUTPUT",
      historyId: "123456asdfg",
      valueToRender: 10403,
      level: "OUTPUT"
    });
    expect(hist.find(ConsoleMessage).length).toBe(1);
    expect(hist.find(ValueRenderer).length).toBe(1);
  });

  it("always renders the FETCH_CELL_INFO as an ConsoleMessage component with a PreformattedTextItem in it", () => {
    const hist = historyItem({
      historyType: "FETCH_CELL_INFO",
      historyId: "123456asdfg",
      valueToRender: [{ text: "a", id: "z" }, { text: "b", id: "y" }],
      level: "ERROR"
    });
    expect(hist.find(ConsoleMessage).length).toBe(1);
    expect(hist.find(PreformattedTextItemsHandler).length).toBe(1);
  });
});
