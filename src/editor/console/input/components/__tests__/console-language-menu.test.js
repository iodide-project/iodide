import { mapStateToProps } from "../console-language-menu";

describe("ConsoleLanguageMenu mapStateToProps", () => {
  let state;
  beforeEach(() => {
    state = {
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
});
