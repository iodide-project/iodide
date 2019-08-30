import {
  hasAllowedProtocol,
  couldBeValidProtocol,
  validateUrl,
  couldBeValidFilename,
  validateFilename
} from "../validators";

describe("couldBeValidProtocol", () => {
  it("validates possible protocols", () => {
    expect(couldBeValidProtocol("http")).toBe(true);
    expect(couldBeValidProtocol("h")).toBe(true);
    expect(couldBeValidProtocol("")).toBe(true);
    expect(couldBeValidProtocol("https://")).toBe(true);
    expect(couldBeValidProtocol("http://")).toBe(true);
    expect(couldBeValidProtocol("htps")).toBe(false);
    expect(couldBeValidProtocol("https:////")).toBe(false);
  });
});

describe("hasAllowedProtocol", () => {
  it("looks for a valid protocol", () => {
    expect(hasAllowedProtocol("https://thing.com")).toBe(true);
    expect(hasAllowedProtocol("http://thing.com")).toBe(true);
    expect(hasAllowedProtocol("thing.com")).toBe(false);
    expect(hasAllowedProtocol("//thing.com")).toBe(false);
    expect(hasAllowedProtocol("https://")).toBe(true);
    expect(hasAllowedProtocol("http://")).toBe(true);
  });
});

describe("validateUrl", () => {
  it("validates a wide variety of urls", () => {
    expect(validateUrl("")).toBe(false);
    expect(validateUrl("htt")).toBe(false);
    expect(validateUrl("https://")).toBe(false);
    expect(validateUrl("whatever.com")).toBe(false);
    expect(validateUrl("http://whatever.com")).toBe(true);
    expect(validateUrl("https://whatever.com")).toBe(true);
  });
});

describe("couldBeValidFilename", () => {
  expect(couldBeValidFilename("a")).toBe(true);
  expect(couldBeValidFilename("aa")).toBe(true);
  expect(couldBeValidFilename("aaa")).toBe(true);
  expect(couldBeValidFilename("aaaa")).toBe(true);
  expect(couldBeValidFilename("aaaa///")).toBe(false);
  expect(couldBeValidFilename("/a")).toBe(false);
  expect(couldBeValidFilename("/aa")).toBe(false);
  expect(couldBeValidFilename("/aaaaaaaaa")).toBe(false);
  expect(couldBeValidFilename("/aaaaaaaaaaa/")).toBe(false);
});

describe("validateFilename", () => {
  expect(validateFilename("a")).toBe(false);
  expect(validateFilename("aa")).toBe(false);
  expect(validateFilename("aaa")).toBe(true);
  expect(validateFilename("test.csv")).toBe(true);
  expect(validateFilename("test/this.csv")).toBe(false);
  expect(validateFilename("/test.csv")).toBe(false);
  expect(validateFilename("test-this.json")).toBe(true);
  expect(validateFilename("test-this/next.json")).toBe(false);
  expect(validateFilename("test_this.json")).toBe(true);
});
