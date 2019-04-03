import {
  saveFile,
  loadFile,
  deleteFile,
  handleLoadedVariable,
  connectExists,
  connectList,
  connectLastUpdated
} from "../file";

const mockStore = () => ({
  getState() {
    return {
      notebookInfo: {
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
  }
});

describe("iodide.file.list (connectList)", () => {
  const store = mockStore();
  const list = connectList(store);
  it("lists all the files available to the current notebook", () => {
    const files = list();
    expect(files).toEqual(
      store.getState().notebookInfo.files.map(f => f.filename)
    );
  });
});

describe("iodide.file.exists", () => {
  const store = mockStore();
  const exists = connectExists(store);
  it("throws if something other than a string is passed in", () => {
    expect(() => exists()).toThrow();
    expect(() => exists(12345)).toThrow();
    expect(() => exists(new Date())).toThrow();
  });
  it("returns true / false if a file exists / doesn't exist", () => {
    expect(exists("file1.csv")).toBe(true);
    expect(exists("nonexistant-file.arrow")).toBe(false);
  });
});

describe("iodide.file.lastUpdated", () => {
  const store = mockStore();
  const lastUpdated = connectLastUpdated(store);
  it("throws if something other than a string is passed in", () => {
    expect(() => lastUpdated()).toThrow();
    expect(() => lastUpdated(12345)).toThrow();
    expect(() => lastUpdated(new Date())).toThrow();
  });
  it("Date object if file exists, throws if the file does not exist", () => {
    expect(lastUpdated("file1.csv")).toEqual(
      new Date(store.getState().notebookInfo.files[0].lastUpdated)
    );
    expect(() => lastUpdated("nonexistant-file.arrow")).toThrowError();
  });
});

describe("iodide.file.save (saveFile)", () => {
  it("throws errors if you have the incorrect argument types", () => {
    expect(() => saveFile()).toThrowError();
    expect(() => saveFile(12345)).toThrowError();
    expect(() => saveFile(12345, new Date())).toThrowError();
  });
  it("returns a Promise", () => {
    const request = saveFile(12345, "test.csv");
    expect(request instanceof Promise).toBeTruthy();
  });
});

describe("handleLoadedVariable", () => {
  const testCases = [
    { input: { fetchType: "css" }, output: undefined },
    { input: { fetchType: "js" }, output: undefined },
    {
      input: { fetchType: "text", varName: "TEXT", value: "text-test" },
      output: "text-test"
    },
    {
      input: { fetchType: "json", varName: "JSON", value: "json-test" },
      output: "json-test"
    },
    {
      input: { fetchType: "blob", varName: "BLOB", value: "blob-test" },
      output: "blob-test"
    }
  ];

  it("adds the variable if of the proper fetchType", () => {
    testCases.forEach(testCase => {
      handleLoadedVariable(testCase.input.fetchType, testCase.input.varName)(
        testCase.input.value
      );
      // NB: window is global in jest tests.
      expect(global[testCase.input.varName]).toBe(testCase.output);
    });
  });
});

describe("iodide.file.load (loadFile)", () => {
  it("throws errors if you have the incorrect argument types", () => {
    expect(() => loadFile()).toThrowError();
    expect(() => loadFile(12345, 12345)).toThrowError();
    expect(() => loadFile(12345, 12345, 12345)).toThrowError();
  });
  it("returns a Promise", () => {
    const request = loadFile("test.csv", "text", "variableName");
    expect(request instanceof Promise).toBeTruthy();
  });
});

describe("iodide.file.delete (deleteFile)", () => {
  it("throws errors if you have the incorrect argument types", () => {
    expect(() => deleteFile()).toThrowError();
    expect(() => deleteFile(new Date())).toThrowError();
  });
  it("returns a Promise", () => {
    const request = deleteFile("test.csv");
    expect(request instanceof Promise).toBeTruthy();
  });
});
