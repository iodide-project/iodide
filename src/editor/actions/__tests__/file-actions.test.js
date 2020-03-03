import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { updateFiles, deleteFile } from "../file-actions";
import * as CALLBACKS from "../file-request-callbacks";
import * as FILE_OPS from "../../../shared/utils/file-operations";

const mockStore = configureMockStore([thunk]);
const initialState = () => {
  return {
    userData: { name: "this-user" },
    notebookInfo: {
      connectionMode: "SERVER",
      username: "this-user",
      files: [
        {
          filename: "test.csv",
          id: 0,
          lastUpdated: "2019-04-03T16:51:45.075609+00:00",
          status: "saved"
        },
        {
          filename: "test2.csv",
          id: 0,
          lastUpdated: "2019-04-04T16:51:45.075609+00:00",
          status: "saved"
        }
      ]
    }
  };
};

describe("updateFiles", () => {
  it("translates a response from the server as expected", async () => {
    const getFilesMock = jest.spyOn(FILE_OPS, "getFilesForNotebookFromServer");
    getFilesMock.mockImplementation(() => {
      return Promise.resolve([
        {
          id: 1,
          filename: "test.csv",
          notebook_id: 0,
          last_updated: "a-date-string"
        }
      ]);
    });
    const store = mockStore(initialState());

    const request = store.dispatch(updateFiles());

    await expect(request).resolves.toBe(undefined);

    expect(getFilesMock).toHaveBeenCalledTimes(1);

    expect(store.getActions()).toEqual([
      {
        type: "UPDATE_FILES_FROM_SERVER",
        serverFiles: [
          {
            filename: "test.csv",
            id: 1,
            lastUpdated: "a-date-string",
            status: "saved"
          }
        ]
      }
    ]);
  });
});

describe("deleteFile", () => {
  let deleteFileMock;
  let postSuccessMock;
  let postErrorMock;
  let store;

  beforeEach(() => {
    deleteFileMock = jest.spyOn(FILE_OPS, "deleteFileOnServer");
    deleteFileMock.mockReset();
    postSuccessMock = jest.spyOn(CALLBACKS, "postFileOperationSuccessMessage");
    postSuccessMock.mockReset();
    postErrorMock = jest.spyOn(CALLBACKS, "postFileOperationErrorMessage");
    postErrorMock.mockReset();
    store = mockStore(initialState());
  });

  ["from-editor", "from-eval-frame"].forEach(variant => {
    const options =
      variant === "from-eval-frame"
        ? { fileRequestID: "some-file-request-id" }
        : {};

    it(`fails if attempting to delete a non-existent file (${variant})`, async () => {
      await expect(
        store.dispatch(deleteFile("does-not-exist.csv", options))
      ).resolves.toBe(undefined);

      if (variant === "from-editor") {
        expect(postErrorMock).toHaveBeenCalledTimes(0);
        expect(store.getActions()).toEqual([
          {
            type: "UPDATE_FILE",
            status: "error",
            filename: "does-not-exist.csv",
            errorMessage: '(delete) file "does-not-exist.csv" does not exist'
          }
        ]);
      } else {
        expect(postErrorMock).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual([{ type: "NOOP" }]);
      }
    });

    it(`successfully handles a server error on deleteFileFromServer (${variant})`, async () => {
      deleteFileMock.mockImplementation(() => {
        return Promise.reject(new Error("artificial error"));
      });

      await expect(
        store.dispatch(deleteFile("test.csv", options))
      ).resolves.toBe(undefined);

      expect(deleteFileMock).toHaveBeenCalledTimes(1);
      if (variant === "from-editor") {
        expect(postErrorMock).toHaveBeenCalledTimes(0);
        expect(store.getActions()).toEqual([
          {
            type: "UPDATE_FILE",
            status: "error",
            filename: "test.csv",
            errorMessage: "artificial error"
          }
        ]);
      } else {
        expect(postErrorMock).toHaveBeenCalledTimes(1);
        expect(store.getActions()).toEqual([{ type: "NOOP" }]);
      }
    });

    it(`successfully calls deleteFileFromServer & dispatches DELETE_FILE (${variant})`, async () => {
      deleteFileMock.mockImplementation(() => {
        return Promise.resolve(undefined);
      });

      await expect(
        store.dispatch(deleteFile("test.csv", options))
      ).resolves.toBe(undefined);

      expect(deleteFileMock).toHaveBeenCalled();
      expect(store.getActions()).toEqual([
        {
          filename: "test.csv",
          status: "deleted",
          type: "UPDATE_FILE"
        }
      ]);
      if (variant === "from-editor") {
        expect(postSuccessMock).toHaveBeenCalledTimes(0);
      } else {
        expect(postSuccessMock).toHaveBeenCalledTimes(1);
      }
    });
  });
});
