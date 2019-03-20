import { connectList, connectExists } from "../file";

import { store } from "./file-mocks";

describe("save", () => {});

describe("load", () => {});

describe("iodide.file.list", () => {
  const list = connectList(store);
  it("lists all the files available to the current notebook", () => {
    const files = list();
    expect(files).toEqual(["file1.csv", "file2.csv", "file3.csv"]);
  });
});

describe("iodide.file.exists", () => {
  const exists = connectExists(store);
  it("returns true / false if a file exists / doesn't exist", () => {
    expect(exists("file1.csv")).toBe(true);
    expect(exists("nonexistant-file.json")).toBe(false);
  });
  it("throws if something other than a string is passed in", () => {
    expect(() => exists()).toThrow();
    expect(() => exists(12345)).toThrow();
    expect(() => exists(new Date())).toThrow();
  });
});
