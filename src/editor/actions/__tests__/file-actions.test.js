import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { getFiles } from "../file-actions";
import * as FILE_OPS from "../../../shared/utils/file-operations";

const mockStore = configureMockStore([thunk]);
const initialState = () => {
  return {
    userData: { name: "this-user" },
    notebookInfo: {
      connectionMode: "SERVER",
      username: "this-user"
    }
  };
};

describe("getFiles (editor action)", () => {
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

    const request = store.dispatch(getFiles());

    await expect(request).resolves.toBe(undefined);

    expect(getFilesMock).toHaveBeenCalledTimes(1);

    expect(store.getActions()).toEqual([
      {
        type: "UPDATE_FILES_FROM_SERVER",
        files: [{ filename: "test.csv", id: 1, lastUpdated: "a-date-string" }]
      }
    ]);
  });
});
