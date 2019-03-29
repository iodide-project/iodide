import { getLocalAutosaveState, updateLocalAutosave } from "../local-autosave";
import { newNotebook } from "../../state-schemas/editor-state-prototypes";

let states;
const jsmdContent = `%% js
var x = 10

%% md

# the title
`;

describe("updateLocalAutosave", () => {
  beforeEach(() => {
    const originalState = newNotebook();
    updateLocalAutosave(originalState, true);

    // add some state
    const stateUpdate = {
      jsmd: jsmdContent,
      title: "autosaved title"
    };
    const updatedState = Object.assign({}, originalState, stateUpdate);

    states = {
      originalState,
      updatedState
    };
  });

  it("saves over original when asked to", async () => {
    updateLocalAutosave(states.updatedState, true);
    const newAutosavedState = await getLocalAutosaveState(states.updatedState);
    expect(Object.keys(newAutosavedState).sort()).toEqual([
      "originalCopy",
      "originalCopyRevision",
      "originalSaved"
    ]);
    const originalCopyState = newAutosavedState.originalCopy;
    expect(originalCopyState).toEqual(states.updatedState.jsmd);
  });

  it("only updates dirty copy when not asked to write over original", async () => {
    await updateLocalAutosave(states.updatedState, false);
    const newAutosavedState = await getLocalAutosaveState(states.updatedState);
    expect(Object.keys(newAutosavedState).sort()).toEqual([
      "dirtyCopy",
      "dirtySaved",
      "originalCopy",
      "originalCopyRevision",
      "originalSaved"
    ]);

    const originalCopyState = newAutosavedState.originalCopy;
    expect(originalCopyState).toEqual(states.originalState.jsmd);
    // FIXME: deprecating the meta tag where we receive title. Will this test be relevant?
    // expect(originalCopyState.title).toEqual(states.originalState.title)

    const dirtyCopyState = newAutosavedState.dirtyCopy;
    expect(dirtyCopyState).toEqual(states.updatedState.jsmd);
    // FIXME: deprecating the meta tag where we receive title.
    // expect(dirtyCopyState.title).toEqual(states.updatedState.title)
  });
});
