import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { APIError } from "../../../shared/server-api/api-request";
import {
  createNotebookRequest,
  getNotebookRequest,
  updateNotebookRequest
} from "../../../shared/server-api/notebook";
import {
  checkNotebookIsBasedOnLatestServerRevision,
  createNewNotebookOnServer,
  revertToLatestServerRevision,
  saveNotebookToServer
} from "../server-save-actions";

jest.mock("../../../shared/server-api/notebook");
jest.mock("../../tools/local-autosave");

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const initialState = notebookCreated => {
  return {
    iomd: "initial content",
    title: "initial title",
    modalState: "MODALS_CLOSED",
    userData: { name: "this-user" },
    notebookInfo: Object.assign(
      {
        connectionMode: "SERVER",
        username: "this-user"
      },
      notebookCreated ? { revision_id: 1, notebook_id: 1 } : {}
    )
  };
};

const errorCases = [
  {
    error: new APIError("Bad Request", "BAD_REQUEST", [
      "Based on non-latest revision 1 (expected 2)"
    ]),
    expectedStatus: "ERROR_OUT_OF_DATE"
  },
  {
    error: new APIError("Forbidden", "FORBIDDEN", "Bad permissions"),
    expectedStatus: "ERROR_UNAUTHORIZED"
  },
  {
    error: new APIError("Unknown Error", "UNKNOWN_ERROR", {
      detail: "Some horrible thing"
    }),
    expectedStatus: "ERROR_GENERAL"
  }
];

describe("saveNotebookToServer", () => {
  it("works as expected when there is no notebook on the server yet", async () => {
    const store = mockStore({
      ...initialState(false)
    });
    createNotebookRequest.mockResolvedValue({
      id: 1,
      latest_revision: {
        id: 1
      }
    });
    await expect(store.dispatch(saveNotebookToServer())).resolves.toBe(
      undefined
    );
    expect(store.getActions()).toEqual([
      {
        notebookInfo: {
          notebook_id: 1,
          revision_id: 1,
          revision_is_latest: true,
          serverSaveStatus: "OK",
          tryItMode: false,
          user_can_save: true,
          username: "this-user"
        },
        type: "UPDATE_NOTEBOOK_INFO"
      }
    ]);
  });

  it("works as expected when there is a notebook already saved", async () => {
    const state = initialState(true);
    const store = mockStore(state);
    updateNotebookRequest.mockReset();
    updateNotebookRequest.mockResolvedValueOnce({
      id: 2
    });
    await expect(store.dispatch(saveNotebookToServer())).resolves.toBe(
      undefined
    );
    expect(updateNotebookRequest.mock.calls).toEqual([
      [
        1,
        1, // parent revision id should be 1
        state.title,
        state.iomd
      ]
    ]);
    expect(store.getActions()).toEqual([
      {
        notebookInfo: {
          revision_id: 2,
          revision_is_latest: true,
          serverSaveStatus: "OK"
        },
        type: "UPDATE_NOTEBOOK_INFO"
      }
    ]);
  });

  it("does not send revision id when force-saving", async () => {
    const state = initialState(true);
    const store = mockStore(state);
    updateNotebookRequest.mockReset();
    updateNotebookRequest.mockResolvedValueOnce({
      id: 2
    });
    await expect(store.dispatch(saveNotebookToServer(true))).resolves.toBe(
      undefined
    );
    expect(updateNotebookRequest.mock.calls).toEqual([
      [
        1,
        undefined, // parent revision id should be undefined
        state.title,
        state.iomd
      ]
    ]);
  });

  // iterate through a variety of failure scenarios
  errorCases.forEach(errorCase =>
    it(`handles error ${errorCase.error.status} as expected`, async () => {
      const store = mockStore(initialState(true));
      updateNotebookRequest.mockRejectedValueOnce(errorCase.error);

      await expect(store.dispatch(saveNotebookToServer())).rejects.toThrowError(
        APIError
      );
      expect(store.getActions()).toEqual([
        {
          type: "UPDATE_NOTEBOOK_INFO",
          notebookInfo: { serverSaveStatus: errorCase.expectedStatus }
        }
      ]);
    })
  );
});

describe("createNewNotebookOnServer", () => {
  [true, false].forEach(forked => {
    it(forked ? "forked" : "not forked", async () => {
      const state = initialState(forked);
      const store = mockStore(state);
      createNotebookRequest.mockClear();
      createNotebookRequest.mockResolvedValue({
        id: forked ? 2 : 1,
        latest_revision: {
          id: forked ? 2 : 1
        }
      });
      await expect(store.dispatch(createNewNotebookOnServer())).resolves.toBe(
        undefined
      );
      expect(createNotebookRequest.mock.calls).toEqual(
        forked
          ? [[state.title, state.iomd, { forked_from: 1 }]]
          : [[state.title, state.iomd, {}]]
      );

      expect(store.getActions()).toEqual([
        {
          notebookInfo: {
            notebook_id: forked ? 2 : 1,
            revision_id: forked ? 2 : 1,
            revision_is_latest: true,
            serverSaveStatus: "OK",
            tryItMode: false,
            user_can_save: true,
            username: "this-user"
          },
          type: "UPDATE_NOTEBOOK_INFO"
        }
      ]);
    });
  });

  // iterate through a variety of failure scenarios
  errorCases.forEach(errorCase =>
    it(`handles error ${errorCase.error.status} as expected`, async () => {
      const store = mockStore(initialState(true));
      createNotebookRequest.mockRejectedValueOnce(errorCase.error);

      await expect(
        store.dispatch(createNewNotebookOnServer())
      ).rejects.toThrowError(APIError);
      expect(store.getActions()).toEqual([
        {
          notebookInfo: { serverSaveStatus: errorCase.expectedStatus },
          type: "UPDATE_NOTEBOOK_INFO"
        }
      ]);
    })
  );
});

describe("revertToLatestServerRevision", () => {
  it("base case", async () => {
    const store = mockStore({
      ...initialState(false)
    });
    getNotebookRequest.mockResolvedValue({
      id: 1,
      latest_revision: {
        id: 4,
        title: "newer revision",
        created: "2018-09-13T21:37:04.353408Z",
        content: "newer content"
      }
    });
    await expect(store.dispatch(revertToLatestServerRevision())).resolves.toBe(
      undefined
    );
    expect(store.getActions()).toEqual([
      { type: "UPDATE_IOMD_CONTENT", iomd: "newer content" },
      { type: "UPDATE_NOTEBOOK_TITLE", title: "newer revision" },
      {
        type: "UPDATE_NOTEBOOK_INFO",
        notebookInfo: {
          revision_id: 4,
          revision_is_latest: true
        }
      }
    ]);
  });
});

describe("checkNotebookIsBasedOnLatestServerRevision", () => {
  [false, true].forEach(titleDiffers => {
    [false, true].forEach(contentDiffers => {
      it(`case where local revision is out of date (${
        titleDiffers ? "different title" : "same title"
      }, ${
        contentDiffers ? "different content" : "same content"
      })`, async () => {
        const store = mockStore({
          ...initialState(true)
        });

        const newRevisionId = 4;
        getNotebookRequest.mockResolvedValue({
          id: 1,
          latest_revision: {
            id: newRevisionId,
            title: titleDiffers ? "exciting new title" : store.getState().title,
            created: "2018-09-13T21:37:04.353408Z",
            content: contentDiffers
              ? "exciting new content"
              : store.getState().iomd
          }
        });

        await expect(
          store.dispatch(checkNotebookIsBasedOnLatestServerRevision())
        ).resolves.toBe(undefined);
        expect(store.getActions()).toEqual([
          {
            type: "UPDATE_NOTEBOOK_INFO",
            notebookInfo: Object.assign(
              {
                revision_is_latest: !contentDiffers && !titleDiffers
              },
              !contentDiffers && !titleDiffers
                ? { revision_id: newRevisionId }
                : {}
            )
          }
        ]);
      });
    });
  });
});
