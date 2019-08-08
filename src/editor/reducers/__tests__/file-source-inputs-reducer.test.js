import fileSourceInputsReducer from "../file-source-inputs-reducer";

const initialState = () => ({
  fileSourceInputs: {
    filename: "",
    url: "",
    updateInterval: "daily"
  }
});

const FS = state => state.fileSourceInputs;

describe("UPDATE_FILE_SOURCE_INPUT_FILENAME", () => {
  let state;
  beforeEach(() => {
    state = initialState();
  });
  it("updates filename", () => {
    const nextState = fileSourceInputsReducer(state, {
      type: "UPDATE_FILE_SOURCE_INPUT_FILENAME",
      filename: "test.json"
    });
    expect(FS(nextState).filename).toBe("test.json");
  });
});

describe("UPDATE_FILE_SOURCE_INPUT_URL", () => {
  let state;
  beforeEach(() => {
    state = initialState();
  });
  it("updates url", () => {
    const nextState = fileSourceInputsReducer(state, {
      type: "UPDATE_FILE_SOURCE_INPUT_URL",
      url: "https://whatever.com"
    });
    expect(FS(nextState).url).toBe("https://whatever.com");
  });
});

describe("UPDATE_FILE_SOURCE_INPUT_UPDATE_INTERVAL", () => {
  let state;
  beforeEach(() => {
    state = initialState();
  });
  it("updates url", () => {
    const nextState = fileSourceInputsReducer(state, {
      type: "UPDATE_FILE_SOURCE_INPUT_UPDATE_INTERVAL",
      updateInterval: "weekly"
    });
    expect(FS(nextState).updateInterval).toBe("weekly");
  });
});
