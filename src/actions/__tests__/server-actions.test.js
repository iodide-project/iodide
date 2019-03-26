import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { saveNotebookToServer } from "../actions";
import { updateServerAutosave, flushServerAutosave } from "../server-actions";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock("../actions");

describe("updateServerAutosave expected behaviour", () => {
  [false, true].forEach(revisionIsLatest => {
    it(`saveNotebookToServer ${
      revisionIsLatest ? "is" : "is not"
    } called if revision_is_latest is ${revisionIsLatest}`, () => {
      const store = mockStore({
        notebookInfo: {
          revision_is_latest: revisionIsLatest,
          username: "testuser"
        },
        userData: { name: "testuser" }
      });
      store.dispatch(updateServerAutosave());
      flushServerAutosave();
      expect(saveNotebookToServer.mock.calls.length).toBe(
        revisionIsLatest ? 1 : 0
      );
    });
  });
});
