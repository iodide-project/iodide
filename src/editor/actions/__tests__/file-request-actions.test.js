// we will spyOn / mock these file operations
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as FILE_OPS from "../../../shared/utils/file-operations";
import * as CALLBACKS from "../file-request-callbacks";

import { saveFileRequest, loadFileRequest } from "../file-request-actions";

const mockStore = configureMockStore([thunk]);

const initialState = () => {
  return {
    userData: { name: "this-user" },
    notebookInfo: {
      connectionMode: "SERVER",
      notebook_id: 1,
      username: "this-user",
      files: [
        {
          filename: "file1.csv",
          status: "saved",
          id: 0,
          lastUpdated: "2019-04-03T16:51:45.075609+00:00"
        }
      ]
    }
  };
};

jest.useFakeTimers();

describe("loadFileRequest (from eval frame)", () => {
  let loadFileMock;
  let successMock;
  let errorMock;
  let store;

  beforeEach(() => {
    loadFileMock = jest.spyOn(FILE_OPS, "loadFileFromServer");
    loadFileMock.mockReset();
    successMock = jest.spyOn(CALLBACKS, "postFileOperationSuccessMessage");
    successMock.mockReset();
    errorMock = jest.spyOn(CALLBACKS, "postFileOperationErrorMessage");
    errorMock.mockReset();
    store = mockStore(initialState());
  });

  it("sends message back to eval-frame signaling success when the return value of loadFile rejects (server returns error)", async () => {
    loadFileMock.mockImplementation(() => {
      return Promise.reject(new Error("artificial error"));
    });
    const request = store.dispatch(
      loadFileRequest("file1.csv", "file-request-id-0", "text")
    );

    await expect(request).resolves.toBe(undefined);
    expect(loadFileMock).toHaveBeenCalledTimes(1);
    expect(store.getActions()).toEqual([]);
    expect(errorMock).toHaveBeenCalledTimes(1);
  });

  it("sends message back to eval-frame signaling success when the return value of loadFile resolves (server returns success)", async () => {
    loadFileMock.mockImplementation(() => {
      return Promise.resolve("loaded-file-contents");
    });

    const request = store.dispatch(
      loadFileRequest("file1.csv", "file-request-id-0", "text")
    );

    jest.runAllTicks();

    await expect(request).resolves.toBe(undefined);
    expect(loadFileMock).toHaveBeenCalledTimes(1);
    expect(successMock).toHaveBeenCalledTimes(1);
  });
});

describe("saveFileRequest (from eval frame)", () => {
  let uploadFileMock;
  let successMock;
  let errorMock;
  let store;

  beforeEach(() => {
    uploadFileMock = jest.spyOn(FILE_OPS, "uploadFile");
    uploadFileMock.mockReset();
    successMock = jest.spyOn(CALLBACKS, "postFileOperationSuccessMessage");
    successMock.mockReset();
    errorMock = jest.spyOn(CALLBACKS, "postFileOperationErrorMessage");
    errorMock.mockReset();
    store = mockStore(initialState());
  });

  it("returns error if there was a server error, passing the reason down to the eval frame", async () => {
    uploadFileMock.mockImplementation(() => {
      throw new Error("Upload failed");
    });

    await expect(
      store.dispatch(
        saveFileRequest("new-data.csv", "file-request-id-0", "data", true)
      )
    ).resolves.toBe(undefined);

    expect(uploadFileMock).toHaveBeenCalledTimes(1);
    expect(store.getActions()).toEqual([{ type: "NOOP" }]);
    expect(errorMock).toHaveBeenCalledTimes(1);
  });

  it("successfully calls saveFileToServer & dispatches UPDATE_FILE", async () => {
    uploadFileMock.mockImplementation(() => {
      return Promise.resolve({
        filename: "test.csv",
        id: 0,
        last_updated: "a-date-string"
      });
    });

    await expect(
      store.dispatch(
        saveFileRequest("new-data.csv", "file-request-id-0", "data", true)
      )
    ).resolves.toBe(undefined);

    expect(uploadFileMock).toHaveBeenCalledTimes(1);

    expect(store.getActions()).toEqual([
      {
        type: "UPDATE_FILE",
        filename: "test.csv",
        lastUpdated: "a-date-string",
        status: "saved",
        errorMessage: undefined,
        fileID: 0
      }
    ]);
    expect(successMock).toHaveBeenCalledTimes(1);
  });
});
