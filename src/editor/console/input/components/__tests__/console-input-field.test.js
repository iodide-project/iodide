import { mount } from "enzyme";
import React from "react";

import {
  ConsoleInputUnconnected,
  mapStateToProps
} from "../console-input-field";

describe("ConsoleInputUnconnected React component", () => {
  let props;
  let mountedComponent;
  let updateConsoleText;
  let consoleHistoryStepBack;
  let evalConsoleInput;

  const consoleInput = () => {
    if (!mountedComponent) {
      mountedComponent = mount(<ConsoleInputUnconnected {...props} />);
    }
    return mountedComponent;
  };

  const textArea = () => consoleInput().find("textarea");

  beforeEach(() => {
    updateConsoleText = jest.fn();
    consoleHistoryStepBack = jest.fn();
    evalConsoleInput = jest.fn();

    props = {
      consoleText: "foo\nbar\nbat",
      updateConsoleText,
      consoleHistoryStepBack,
      evalConsoleInput
    };
    mountedComponent = undefined;
  });

  it("always renders container div with class console-text-input-container", () => {
    expect(
      consoleInput().find("div.console-text-input-container")
    ).toHaveLength(1);
  });
  it("textArea has correct content initially, and it updates correctly", () => {
    expect(textArea().props().value).toBe("foo\nbar\nbat");
    textArea().simulate("change", { target: { value: "123" } });
    expect(textArea().props().value).toBe("123");
  });

  it("calls correct prop fns on ArrowUp when on first line", () => {
    const component = consoleInput();
    jest
      .spyOn(component.instance(), "onFirstLine")
      .mockImplementation(() => true);
    component.instance().forceUpdate();

    textArea().simulate("keyDown", { key: "ArrowUp" });

    expect(updateConsoleText).toHaveBeenCalled();
    expect(consoleHistoryStepBack).toHaveBeenCalled();
    expect(consoleHistoryStepBack.mock.calls[0][0]).toBe(1);
  });

  it("calls correct prop fns on ArrowDown when on last line", () => {
    const component = consoleInput();
    jest
      .spyOn(component.instance(), "onLastLine")
      .mockImplementation(() => true);
    component.instance().forceUpdate();

    textArea().simulate("keyDown", { key: "ArrowDown" });

    expect(updateConsoleText).toHaveBeenCalled();
    expect(consoleHistoryStepBack).toHaveBeenCalled();
    expect(consoleHistoryStepBack.mock.calls[0][0]).toBe(-1);
  });

  it("calls prop fn evalConsoleInput on Enter in textArea", () => {
    textArea().simulate("keyDown", { key: "Enter" });
    expect(evalConsoleInput).toHaveBeenCalled();
    expect(evalConsoleInput.mock.calls[0][0]).toBe("foo\nbar\nbat");
  });

  it("resets console on Enter in textArea", () => {
    expect(textArea().props().value).toBe("foo\nbar\nbat");
    textArea().simulate("keyDown", { key: "Enter" });
    expect(textArea().props().value).toBe("");
  });

  it("does NOT call prop fn evalConsoleInput on Enter WITH shift in textArea", () => {
    textArea().simulate("keyDown", { key: "Enter", shiftKey: true });
    expect(evalConsoleInput).not.toHaveBeenCalled();
  });

  it("resizes when updated", () => {
    const component = consoleInput();
    const resizeToFitText = jest.spyOn(component.instance(), "resizeToFitText");
    component.instance().forceUpdate();

    textArea().simulate("keyDown", { key: "Enter" });

    expect(resizeToFitText).toHaveBeenCalled();
  });
});

describe("ConsoleInput mapStateToProps", () => {
  let state;
  beforeEach(() => {
    state = { consoleInput: { consoleText: "TEST_TEXT" } };
  });

  it("loads state.consoleTest as expected", () => {
    expect(mapStateToProps(state).consoleText).toEqual("TEST_TEXT");
  });
});
