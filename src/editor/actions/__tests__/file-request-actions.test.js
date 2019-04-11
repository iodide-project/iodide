// we will spyOn / mock these file operations
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as FILE_OPS from "../../../shared/utils/file-operations";
import * as CALLBACKS from "../file-request-callbacks";

import { saveFile, loadFile, deleteFile } from "../file-request-actions";

const mockStore = configureMockStore([thunk]);

const initialState = () => {
  return {
    userData: { name: "this-user" },
    notebookInfo: {
      connectionMode: "SERVER",
      username: "this-user",
      files: [
        {
          filename: "file1.csv",
          id: 0,
          lastUpdated: "2019-04-03T16:51:45.075609+00:00"
        },
        {
          filename: "file2.csv",
          id: 1,
          lastUpdated: "2019-04-01T14:51:00.075609+00:00"
        },
        {
          filename: "file3.csv",
          id: 2,
          lastUpdated: "2019-03-29T22:22:12.075609+00:00"
        }
      ]
    }
  };
};

jest.useFakeTimers();

describe("loadFile (editor action)", () => {
  let loadFileMock;
  let successMock;
  let errorMock;
  let store;

  beforeEach(() => {
    loadFileMock = jest.spyOn(FILE_OPS, "loadFileFromServer");
    loadFileMock.mockReset();
    successMock = jest.spyOn(CALLBACKS, "onFileOperationSuccess");
    successMock.mockReset();
    errorMock = jest.spyOn(CALLBACKS, "onFileOperationError");
    errorMock.mockReset();
    store = mockStore(initialState());
  });

  it("sends message back to eval-frame signaling success when the return value of loadFile rejects (server returns error)", async () => {
    loadFileMock.mockImplementation(() => {
      return Promise.reject(new Error("artificial error"));
    });
    const request = store.dispatch(
      loadFile("file1.csv", "file-request-id-0", "text")
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
      loadFile("file1.csv", "file-request-id-0", "text")
    );

    jest.runAllTicks();

    await expect(request).resolves.toBe(undefined);
    expect(loadFileMock).toHaveBeenCalledTimes(1);
    expect(successMock).toHaveBeenCalledTimes(1);
  });
});

describe("saveFile (editor action)", () => {
  let saveFileMock;
  let successMock;
  let errorMock;
  let store;

  beforeEach(() => {
    saveFileMock = jest.spyOn(FILE_OPS, "saveFileToServer");
    saveFileMock.mockReset();
    successMock = jest.spyOn(CALLBACKS, "onFileOperationSuccess");
    successMock.mockReset();
    errorMock = jest.spyOn(CALLBACKS, "onFileOperationError");
    errorMock.mockReset();
    store = mockStore(initialState());
  });

  it("returns error if there was a server error, passing the reason down to the eval frame", async () => {
    const request = store.dispatch(
      saveFile("new-data.csv", "file-request-id-0", "data", true)
    );

    await expect(request).resolves.toBe(undefined);
    expect(saveFileMock).toHaveBeenCalledTimes(1);
    expect(store.getActions()).toEqual([]);
    expect(errorMock).toHaveBeenCalledTimes(1);
  });

  it("successfully calls saveFileToServer & dispatches ADD_FILE_TO_NOTEBOOK", async () => {
    saveFileMock.mockImplementation(() => {
      return Promise.resolve({
        filename: "test.csv",
        id: 0,
        last_updated: "a-date-string"
      });
    });

    const request = store.dispatch(
      saveFile("new-data.csv", "file-request-id-0", "data", true)
    );

    await expect(request).resolves.toBe(undefined);

    expect(saveFileMock).toHaveBeenCalledTimes(1);

    expect(store.getActions()).toEqual([
      {
        type: "ADD_FILE_TO_NOTEBOOK",
        filename: "test.csv",
        lastUpdated: "a-date-string",
        fileID: 0
      }
    ]);
    expect(successMock).toHaveBeenCalledTimes(1);
  });
});

describe("deleteFile (editor action)", () => {
  let deleteFileMock;
  let successMock;
  let errorMock;
  let store;

  beforeEach(() => {
    deleteFileMock = jest.spyOn(FILE_OPS, "deleteFileOnServer");
    deleteFileMock.mockReset();
    successMock = jest.spyOn(CALLBACKS, "onFileOperationSuccess");
    successMock.mockReset();
    errorMock = jest.spyOn(CALLBACKS, "onFileOperationError");
    errorMock.mockReset();
    store = mockStore(initialState());
  });

  it("fails if attempting to delete a non-existent file", () => {
    store.dispatch(deleteFile("does-not-exist.csv", "some-file-request-id"));
    expect(errorMock).toHaveBeenCalledTimes(1);
  });

  it("successfully handles a server error on deleteFileFromServer and sends the appropriate message back to the eval frame", async () => {
    deleteFileMock.mockImplementation(() => {
      return Promise.reject(new Error("artificial error"));
    });

    const request = store.dispatch(
      deleteFile("file1.csv", "file-request-id-0")
    );

    await expect(request).resolves.toBe(undefined);
    expect(deleteFileMock).toHaveBeenCalledTimes(1);

    expect(store.getActions()).toEqual([]);

    expect(errorMock).toHaveBeenCalledTimes(1);
  });

  it("successfully calls deleteFileFromServer & dispatches DELETE_FILE_FROM_NOTEBOOK", async () => {
    deleteFileMock.mockImplementation(() => {
      return Promise.resolve(undefined);
    });

    const request = store.dispatch(
      deleteFile("file1.csv", "file-request-id-0")
    );

    await expect(request).resolves.toBe(undefined);
    expect(deleteFileMock).toHaveBeenCalled();

    expect(store.getActions()).toEqual([
      {
        fileID: 0,
        type: "DELETE_FILE_FROM_NOTEBOOK"
      }
    ]);

    expect(successMock).toHaveBeenCalledTimes(1);
  });
});
