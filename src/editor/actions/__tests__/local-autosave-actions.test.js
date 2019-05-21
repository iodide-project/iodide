import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { restoreLocalAutosave } from "../local-autosave-actions";
import {
  writeLocalAutosave,
  clearLocalAutosave
} from "../../tools/local-autosave";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const initialState = {
  userData: { name: "this-user" },
  notebookInfo: {
    connectionMode: "SERVER",
    username: "this-user",
    revision_id: 1,
    notebook_id: 1,
    user_can_save: true,
    revision_is_latest: true
  }
};

describe("restoreLocalAutosave", () => {
  beforeEach(() => {
    writeLocalAutosave({
      ...initialState,
      jsmd: "autosaved",
      title: "autosaved title"
    });
  });

  [
    {
      name: "username specified",
      modification: { userData: { name: undefined }, notebookInfo: {} }
    },
    {
      name: "user can save",
      modification: { userData: {}, notebookInfo: { user_can_save: false } }
    },
    {
      name: "revision is latest",
      modification: {
        userData: {},
        notebookInfo: { revision_is_latest: false }
      }
    }
  ].forEach(preconditionFail => {
    it(`does nothing if precondition "${
      preconditionFail.name
    }" is not met`, async () => {
      const store = mockStore({
        userData: {
          ...initialState.userData,
          ...preconditionFail.modification.userData
        },
        notebookInfo: {
          ...initialState.notebookInfo,
          ...preconditionFail.modification.notebookInfo
        }
      });
      await expect(store.dispatch(restoreLocalAutosave())).resolves.toBe(
        undefined
      );
      expect(store.getActions()).toEqual([]);
    });
  });

  it("does nothing if there is no autosave (but preconditions are met)", async () => {
    const store = mockStore(initialState);
    await clearLocalAutosave(initialState);
    await expect(store.dispatch(restoreLocalAutosave())).resolves.toBe(
      undefined
    );
    expect(store.getActions()).toEqual([]);
  });

  it("restores the notebook as expected when all preconditions are met", async () => {
    const store = mockStore(initialState);
    await expect(store.dispatch(restoreLocalAutosave())).resolves.toBe(
      undefined
    );
    expect(store.getActions()).toEqual([
      { type: "UPDATE_MARKDOWN_CHUNKS", reportChunks: [] },
      {
        type: "UPDATE_JSMD_CONTENT",
        jsmd: "autosaved",
        jsmdChunks: [
          {
            chunkContent: "autosaved",
            chunkId: "1679214136_0",
            chunkType: "",
            endLine: 0,
            evalFlags: [],
            startLine: 0
          }
        ]
      },
      { type: "UPDATE_NOTEBOOK_TITLE", title: "autosaved title" },
      { type: "UPDATE_REVISION_ID", id: 1 },
      { type: "UPDATE_NOTEBOOK_REVISION_IS_LATEST", revisionIsLatest: true }
    ]);
  });
});
