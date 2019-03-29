import "../../store";
import notebookReducer from "../notebook-reducer";
import { newNotebook } from "../../state-schemas/editor-state-prototypes";

// FIXME: re-implement tests for the notebook reducer

const EXAMPLE_NOTEBOOK_1 = "example notebook with content";

function exampleNotebookWithContent(title = EXAMPLE_NOTEBOOK_1) {
  const state = newNotebook();
  state.jsmd = `%% js
var x = 10

%% md 

# title element
`;
  state.title = title;
  return state;
}

describe("misc. notebook operations that don't belong elsewhere", () => {
  const state = exampleNotebookWithContent();
  const NEW_NAME = "changed notebook name";
  it("should change title", () => {
    expect(
      notebookReducer(state, { type: "CHANGE_PAGE_TITLE", title: NEW_NAME })
        .title
    ).toEqual(NEW_NAME);
  });
});
