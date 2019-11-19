import { mapStateToProps } from "../console-language-menu";

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
