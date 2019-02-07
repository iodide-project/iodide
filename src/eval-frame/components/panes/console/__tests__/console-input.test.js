import { mount } from "enzyme";
import React from "react";

// FIXME this is an ugly hack to make tests pass without errors;
// importing the store initializes it before other files, pre-empting
// errors that actually result from circular dependencies
import { store } from "../../../../store"; /* eslint-disable-line no-unused-vars */

// import DoubleChevronIcon from '../double-chevron-icon'

import { ConsoleInputUnconnected, mapStateToProps } from "../console-input";
import ConsoleLanguageMenu from "../console-language-menu";

describe("ConsoleInputUnconnected React component", () => {
  let props;
  let mountedComponent;
  let updateConsoleText;
  let consoleHistoryStepBack;
  let evalConsoleInput;
  let setConsoleLanguage;

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
    setConsoleLanguage = jest.fn();

    props = {
      consoleText: "foo\nbar\nbat",
      updateConsoleText,
      consoleHistoryStepBack,
      evalConsoleInput,
      setConsoleLanguage,
      currentLanguage: "js",
      availableLanguages: [
        { languageId: "js", displayName: "Javascript" },
        { languageId: "py", displayName: "Python" }
      ]
    };
    mountedComponent = undefined;
  });

  it("always renders container div with class console-text-input-container", () => {
    expect(
      consoleInput().find("div.console-text-input-container")
    ).toHaveLength(1);
  });
  it("always renders a ConsoleLanguageMenu", () => {
    expect(consoleInput().find(ConsoleLanguageMenu)).toHaveLength(1);
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
    state = {
      consoleText: "TEST_TEXT",
      languageDefinitions: {
        js: { languageId: "js", displayName: "Javascript" },
        py: { languageId: "py", displayName: "Python" }
      },
      loadedLanguages: {
        jl: { languageId: "jl", displayName: "Julia" }
      },
      languageLastUsed: "js"
    };
  });

  it("loads state.consoleTest as expected", () => {
    expect(mapStateToProps(state).consoleText).toEqual("TEST_TEXT");
  });
  it("loads state.currentLanguage as expected", () => {
    expect(mapStateToProps(state).currentLanguage).toEqual("js");
  });
  it("loads state.availableLanguages as expected", () => {
    const props = mapStateToProps(state);
    expect(new Set(props.availableLanguages.map(d => d.languageId))).toEqual(
      new Set(["js", "py", "jl"])
    );
    expect(new Set(props.availableLanguages.map(d => d.displayName))).toEqual(
      new Set(["Javascript", "Python", "Julia"])
    );
  });
});
