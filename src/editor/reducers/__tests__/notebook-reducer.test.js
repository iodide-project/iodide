import "../../store";
import notebookReducer from "../notebook-reducer";
import { newNotebook } from "../../state-schemas/editor-state-prototypes";

// FIXME: re-implement tests for the notebook reducer

const EXAMPLE_NOTEBOOK_1 = "example notebook with content";

function exampleNotebookWithContent(title = EXAMPLE_NOTEBOOK_1) {
  const state = newNotebook();
  state.iomd = `%% js
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
      notebookReducer(state, { type: "UPDATE_NOTEBOOK_TITLE", title: NEW_NAME })
        .title
    ).toEqual(NEW_NAME);
  });
});

describe("update modified locally", () => {
  it("Updates the variable as expected", () => {
    expect(notebookReducer({}, { type: "SET_IOMD_MODIFIED_LOCALLY" })).toEqual({
      iomdModifiedLocally: true
    });
  });
});

describe("update unique state", () => {
  [true, false].forEach(iomdModifiedLocally => {
    it(`update unique state (has local modifications: ${
      iomdModifiedLocally ? "yes" : "no"
    })`, () => {
      expect(
        notebookReducer(
          { iomdModifiedLocally },
          { type: "KERNEL_STATE_UPDATED" }
        )
      ).toEqual({
        iomdModifiedLocally,
        hasUniqueKernelState: iomdModifiedLocally
      });
    });
  });
});
