import { getLocalAutosaveState } from "../local-autosave";
import { newNotebook } from "../../state-schemas/editor-state-prototypes";

jest.mock("../local-autosave");

describe("verify that checking for autosave returns appropriate status", () => {
  let states;

  beforeEach(() => {
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

  it("checkAutosave should return RETRY with no autosave method called if we are checking revision freshness", async () => {
    const { checkUpdateAutosave } = jest.requireActual("../autosave");
    const newState = Object.assign({}, states.updatedState, {
      checkingRevisionIsLatest: true
    });
    expect(await checkUpdateAutosave(newState)).toEqual("RETRY");
  });

  it("checkAutosave should return undefined if revision is not latest", async () => {
    const { checkUpdateAutosave } = jest.requireActual("../autosave");
    const newState = Object.assign({}, states.updatedState, {
      notebookInfo: {
        ...states.updatedState.notebookInfo,
        revision_is_latest: false
      }
    });
    expect(await checkUpdateAutosave(newState)).toEqual("NOOP");
  });

  [true, false].forEach(originalCopyExists => {
    it(`checkAutosave should ask to update as expected if original copy ${
      originalCopyExists ? "does" : "does not"
    } exist`, async () => {
      const { checkUpdateAutosave } = jest.requireActual("../autosave");
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

      expect(await checkUpdateAutosave(newState)).toEqual(
        originalCopyExists ? "UPDATE" : "UPDATE_WITH_NEW_COPY"
      );
    });
  });
});
