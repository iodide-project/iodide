import React from "react";
import { shallow } from "enzyme";

import {
  ConsoleLanguageMenuUnconnected,
  mapStateToProps
} from "../console-language-menu";

describe("ConsoleLanguageMenu mapStateToProps", () => {
  let state;
  beforeEach(() => {
    state = {
      history: [
        { historyId: "wrmhklxskc" },
        { historyId: "xqtol9pck6" },
        { historyId: "7k77hjno1d" }
      ],
      languageDefinitions: {
        js: { languageId: "js", displayName: "JavaScript" },
        py: { languageId: "py", displayName: "Python" }
      },
      loadedLanguages: {
        jl: { languageId: "jl", displayName: "Julia" }
      },
      languageLastUsed: "js"
    };
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
      new Set(["JavaScript", "Python", "Julia"])
    );
  });
  it("sets shouldDisplayClearConsoleAction prop as true when history not empty", () => {
    expect(mapStateToProps(state).shouldDisplayClearConsoleAction).toEqual(
      true
    );
  });
  it("sets shouldDisplayClearConsoleAction prop as false when history empty", () => {
    state.history = [];
    expect(mapStateToProps(state).shouldDisplayClearConsoleAction).toEqual(
      false
    );
  });
});

describe("ConsoleLanguageMenu clearConsoleHistory", () => {
  let props;
  beforeEach(() => {
    props = {
      availableLanguages: [
        {
          languageId: "py",
          displayName: "Python"
        }
      ],
      clearConsoleHistory: jest.fn(),
      currentLanguage: "py",
      setConsoleLanguageProp: jest.fn(),
      shouldDisplayClearConsoleAction: true
    };
  });
  it("calls correct action when 'Clear console' item is clicked", () => {
    const wrapper = shallow(<ConsoleLanguageMenuUnconnected {...props} />, {
      context: {}
    });
    expect(props.clearConsoleHistory).toHaveBeenCalledTimes(0);
    wrapper.findWhere(c => c.key() === "clear-history").simulate("click");
    expect(props.clearConsoleHistory).toHaveBeenCalledTimes(1);
  });
});
