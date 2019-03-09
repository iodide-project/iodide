import { getLocalAutosaveState, updateLocalAutosave } from "../local-autosave";
import { scheduleServerAutoSave } from "../server-autosave";
import { updateAutoSave } from "../autosave";
import { newNotebook } from "../../editor-state-prototypes";

jest.mock("../server-autosave");
jest.mock("../local-autosave");

describe("autosave business logic", () => {
  let states;

  beforeEach(() => {
    jest.clearAllMocks();

    const originalState = {
      ...newNotebook(),
      jsmd: "original content",
      notebookInfo: {
        connectionMode: "SERVER",
        connectionStatus: "CONNECTION_ACTIVE",
        notebook_id: 1
      }
    };

    // add some state
    const stateUpdate = {
      jsmd: "updated content",
      title: "updated title"
    };
    const updatedState = Object.assign({}, originalState, stateUpdate);

    states = {
      originalState,
      updatedState
    };
  });

  it("No autosave method called if we are checking revision freshness", () => {
    const newState = Object.assign({}, states.updatedState, {
      checkingRevisionIsLatest: true
    });
    updateAutoSave(newState);
    expect(updateLocalAutosave.mock.calls.length).toBe(0);
    expect(scheduleServerAutoSave.mock.calls.length).toBe(0);
  });

  it("No autosave method called if revision is not latest", () => {
    const newState = Object.assign({}, states.updatedState, {
      notebookInfo: {
        ...states.updatedState.notebookInfo,
        revision_is_latest: false
      }
    });
    updateAutoSave(newState);
    expect(updateLocalAutosave.mock.calls.length).toBe(0);
    expect(scheduleServerAutoSave.mock.calls.length).toBe(0);
  });

  [true, false].forEach(originalCopyExists => {
    it(`updates autosave as expected if original copy ${
      originalCopyExists ? "does" : "does not"
    } exist`, async () => {
      const newState = Object.assign({}, states.updatedState, {
        originalCopy: originalCopyExists ? states.originalState.jsmd : undefined
      });
      getLocalAutosaveState.mockReturnValueOnce(
        originalCopyExists
          ? {
              originalCopy: states.originalState.jsmd,
              originalCopyRevision:
                states.originalState.notebookInfo.revision_id,
              originalSaved: new Date().toISOString()
            }
          : undefined
      );

      await updateAutoSave(newState);

      expect(getLocalAutosaveState.mock.calls.length).toBe(1);
      expect(updateLocalAutosave.mock.calls.length).toBe(1);
      expect(updateLocalAutosave).toBeCalledWith(newState, !originalCopyExists);
      expect(scheduleServerAutoSave.mock.calls.length).toBe(1);
    });
  });
});
