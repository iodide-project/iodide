import fileSourceReducer from "../file-source-reducer";

const initialState = () => ({
  fileSources: [
    {
      id: 162,
      latest_file_update_operation: {
        id: 318,
        scheduled: "2019-07-24T03:28:35.592234Z",
        started: "2019-07-24T03:28:35.603029Z",
        ended: "2019-07-24T03:28:35.919054Z",
        status: "completed",
        failure_reason: null
      },
      update_interval: "weekly",
      filename: "polls.csv",
      url: "https://whatever.com/api"
    },
    {
      id: 163,
      latest_file_update_operation: {
        id: 319,
        scheduled: "2019-07-24T03:28:58.270366Z",
        started: "2019-07-24T03:28:58.281627Z",
        ended: "2019-07-24T03:28:58.483848Z",
        status: "failed",
        failure_reason:
          "406 Client Error: Not Acceptable for url: https://whatever.com/"
      },
      update_interval: "never",
      filename: "whatever.csv",
      url: "https://whatever.com"
    }
  ]
});

const newFileSource01 = () => {
  return {
    id: 1010,
    latest_file_update_operation: null,
    update_interval: "weekly",
    filename: "new-file.csv",
    url: "https://files-4-u.edu/api/v1/aos9n49vndofn"
  };
};

// when we migrate away from having reducers always operate on
// global state, we should be able to get rid of this function
// or simply rewrite it to return state (the fileSources array)
const FS = state => state.fileSources;

describe("UPDATE_FILE_SOURCES", () => {
  let state;
  beforeEach(() => {
    state = initialState();
  });
  it("updates the file sources entirely if you provide a new array of file sources", () => {
    const nextState = fileSourceReducer(state, {
      type: "UPDATE_FILE_SOURCES",
      fileSources: [newFileSource01()]
    });
    expect(FS(nextState).length).toBe(1);
    expect(FS(nextState)[0].id).toBe(1010);
  });
});

describe("ADD_FILE_SOURCE_TO_NOTEBOOK", () => {
  let state;
  beforeEach(() => {
    state = initialState();
  });
  it("adds a file source to the notebook", () => {
    const nextState = fileSourceReducer(state, {
      type: "ADD_FILE_SOURCE_TO_NOTEBOOK",
      sourceURL: "https://new.com",
      destinationFilename: "file.json",
      updateInterval: "never",
      fileSourceID: 2000
    });
    expect(FS(nextState).length).toBe(3);
    expect(FS(nextState)[2].id).toBe(2000);
  });
});

describe("DELETE_FILE_SOURCE_FROM_NOTEBOOK", () => {
  let state;
  beforeEach(() => {
    state = initialState();
  });
  it("deletes a file source from the notebook", () => {
    const nextState = fileSourceReducer(state, {
      type: "DELETE_FILE_SOURCE_FROM_NOTEBOOK",
      fileSourceID: 162
    });
    expect(FS(nextState).length).toBe(1);
    expect(FS(nextState)[0].id).toBe(163);
  });
});

describe("UPDATE_FILE_SOURCE_STATUS", () => {
  let state;
  beforeEach(() => {
    state = initialState();
  });
  it("updates the status in a particular file source", () => {
    const fileUpdateOperation = {
      id: 320,
      scheduled: "2019-07-24T03:28:58.270366Z",
      started: "2019-07-24T03:28:58.281627Z",
      ended: "2019-07-24T03:28:58.483848Z",
      status: "completed",
      failure_reason: null
    };
    const nextState = fileSourceReducer(state, {
      type: "UPDATE_FILE_SOURCE_STATUS",
      fileSourceID: 162,
      fileUpdateOperation
    });
    expect(FS(nextState)[0].latest_file_update_operation).toEqual(
      fileUpdateOperation
    );
    expect(FS(nextState)[1].latest_file_update_operation).not.toEqual(
      fileUpdateOperation
    );
  });
});
