import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as fileSource from "../../../shared/utils/file-source-operations";

import { addFileSource, deleteFileSource } from "../file-source-actions";

const mockStore = configureMockStore([thunk]);

/*
FIXME: write tests for createFileUpdateOperation (or refactor)
*/

describe("addFileSource", () => {
  let store;
  let testState;

  beforeEach(() => {
    store = undefined;
    testState = {
      notebookInfo: {
        notebook_id: 10000,
        fileSources: [
          {
            fileSourceID: 0,
            sourceURL: "https://whatever.com",
            destinationFilename: "whatever.csv",
            updateInterval: "never",
            lastRan: "some-date",
            lastFileUpdateOperationID: 100,
            lastFileUpdateOperationStatus: "completed"
          }
        ]
      }
    };
  });
  it("adds a file source to the notebook store", async () => {
    const createFileSourceMock = jest.spyOn(
      fileSource,
      "saveFileSourceToServer"
    );
    createFileSourceMock.mockImplementation(async () => {
      return { id: 1001 };
    });
    store = mockStore(testState);
    await store.dispatch(
      addFileSource("whatever.edu/api", "whatever.json", "weekly")
    );

    // here are where the tests go ...
    expect(store.getActions()).toStrictEqual([
      {
        destinationFilename: "whatever.json",
        fileSourceID: 1001,
        sourceURL: "whatever.edu/api",
        type: "ADD_FILE_SOURCE_TO_NOTEBOOK",
        updateInterval: "weekly"
      }
    ]);
    expect(createFileSourceMock).toHaveBeenCalled();
  });
});

describe("deleteFileSource", () => {
  let store;
  let testState;

  beforeEach(() => {
    store = undefined;
    testState = {
      notebookInfo: {
        notebook_id: 10000,
        fileSources: [
          {
            fileSourceID: 0,
            sourceURL: "https://whatever.com",
            destinationFilename: "whatever.csv",
            updateInterval: "never",
            lastRan: "some-date",
            lastFileUpdateOperationID: 100,
            lastFileUpdateOperationStatus: "completed"
          }
        ]
      }
    };
  });
  it("removes a file source from the store", async () => {
    const deleteFileSourceMock = jest.spyOn(
      fileSource,
      "deleteFileSourceFromServer"
    );
    deleteFileSourceMock.mockImplementation(async () => {});
    store = mockStore(testState);
    await store.dispatch(deleteFileSource(0));

    // here are where the tests go ...
    expect(store.getActions()).toStrictEqual([
      {
        fileSourceID: 0,
        type: "DELETE_FILE_SOURCE_FROM_NOTEBOOK"
      }
    ]);
    expect(deleteFileSourceMock).toHaveBeenCalled();
  });
});
