import {
  saveFile,
  loadFile,
  deleteFile,
  connectExists,
  connectList,
  connectLastUpdated
} from "../file/file";
import * as SEND_FILE from "../../tools/send-file-request-to-editor";
import IodideAPIError from "../file/iodide-api-error";

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
  const list = connectList(store.getState);
  it("lists all the files available to the current notebook", () => {
    const files = list();
    expect(files).toEqual(
      store.getState().notebookInfo.files.map(f => f.filename)
    );
  });
});

describe("iodide.file.exists", () => {
  const store = mockStore();
  const exists = connectExists(store.getState);
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
  const lastUpdated = connectLastUpdated(store.getState);
  it("throws if something other than a string is passed in", () => {
    expect(() => lastUpdated()).toThrowError(IodideAPIError);
    expect(() => lastUpdated(12345)).toThrowError(IodideAPIError);
    expect(() => lastUpdated(new Date())).toThrowError(IodideAPIError);
  });
  it("Date object if file exists, throws if the file does not exist", () => {
    expect(lastUpdated("file1.csv")).toEqual(
      new Date(store.getState().notebookInfo.files[0].lastUpdated)
    );
    expect(() => lastUpdated("nonexistant-file.arrow")).toThrowError(
      IodideAPIError
    );
  });
});

describe("iodide.file.save (saveFile)", () => {
  it("throws errors if you have the incorrect argument types", async () => {
    await expect(saveFile()).rejects.toThrowError(IodideAPIError);
    await expect(saveFile("a", 12345)).rejects.toThrowError(IodideAPIError);
    await expect(saveFile("a", 12345, new Date())).rejects.toThrowError(
      IodideAPIError
    );
    await expect(saveFile("a", "textttt", 12345)).rejects.toThrowError(
      IodideAPIError
    );
  });
  it("throws on json stringify errors", async () => {
    // cyclical issues should cause problems with `json`.
    const obj = {};
    obj.a = obj;
    await expect(saveFile("object", "json", obj)).rejects.toThrowError(
      IodideAPIError
    );
  });
  it("throws if a non-array buffer is passed into w/ arrayBuffer", async () => {
    // if not an array buffer when saving _as_ array buffer, throws
    await expect(
      saveFile("thing", "arrayBuffer", "well!!")
    ).rejects.toThrowError(IodideAPIError);
  });
  it("returns a Promise", () => {
    const request = saveFile("test.txt", "text", 12345);
    expect(request instanceof Promise).toBeTruthy();
  });
});

describe("iodide.file.load (loadFile)", () => {
  it("throws errors if you have the incorrect argument types", async () => {
    await expect(loadFile()).rejects.toThrowError(IodideAPIError);
    await expect(loadFile(12345, 12345)).rejects.toThrowError(IodideAPIError);
    await expect(loadFile(12345, 12345, 12345)).rejects.toThrowError(
      IodideAPIError
    );
  });
  it("returns a Promise", () => {
    const request = loadFile("test.csv", "text", "variableName");
    expect(request instanceof Promise).toBeTruthy();
  });
  it("sets window[variableName] if variableName is declared", async () => {
    const testCases = [
      {
        input: {
          fetchType: "text",
          varName: "TEXT",
          value: "text-test-declared"
        },
        output: "text-test-declared"
      },
      {
        input: {
          fetchType: "json",
          varName: "JSON",
          value: "json-test-declared"
        },
        output: "json-test-declared"
      },
      {
        input: {
          fetchType: "blob",
          varName: "BLOB",
          value: "blob-test-declared"
        },
        output: "blob-test-declared"
      },
      {
        input: { fetchType: "text", value: "text-test" },
        output: undefined
      },
      {
        input: { fetchType: "json", value: "json-test" },
        output: undefined
      },
      {
        input: { fetchType: "blob", value: "blob-test" },
        output: undefined
      }
    ];
    let sendFileMock;
    testCases.forEach(async ({ input, output }) => {
      sendFileMock = jest.spyOn(SEND_FILE, "default");
      sendFileMock.mockImplementation(() => {
        return Promise.resolve(input.value);
      });
      await loadFile("file1.csv", input.fetchType, input.varName);
      expect(window[input.varName]).toBe(output);
      sendFileMock.mockReset();
      if (input.varName) {
        delete window[input.varName];
      }
    });
  });
});

describe("iodide.file.delete (deleteFile)", () => {
  it("throws errors if you have the incorrect argument types", async () => {
    await expect(deleteFile()).rejects.toThrowError(IodideAPIError);
    await expect(deleteFile(new Date())).rejects.toThrowError(IodideAPIError);
  });
  it("returns a Promise", () => {
    const request = deleteFile("test.csv");
    expect(request instanceof Promise).toBeTruthy();
  });
});
