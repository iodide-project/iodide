import sendFileRequestToEditor, {
  onParentContextFileRequestSuccess,
  onParentContextFileRequestError,
  fileRequestQueue
} from "../send-file-request-to-editor";

jest.useFakeTimers();

describe("onParentContextFileRequestSuccess / onParentContextFileRequestError", () => {
  let resolveMock;
  let rejectMock;
  beforeEach(() => {
    Object.keys(fileRequestQueue).forEach(k => {
      delete fileRequestQueue[k];
    });
    resolveMock = jest.fn();
    rejectMock = jest.fn();
    fileRequestQueue.tests = {};
    fileRequestQueue.tests.requests = {
      testKey: { resolve: resolveMock, reject: rejectMock }
    };
  });
  it("throws if incorrect arguments are passed into onParentContextFileRequestSuccess", () => {
    expect(() => onParentContextFileRequestSuccess()).toThrowError(TypeError);
    expect(() => onParentContextFileRequestSuccess("test")).toThrowError(
      TypeError
    );
    expect(() =>
      onParentContextFileRequestSuccess(
        "test string",
        "thisFilenameDNE",
        "another bucket"
      )
    ).toThrowError(Error);
    expect(() =>
      onParentContextFileRequestSuccess(
        "test string",
        "test",
        "thisKeyDoesNotExist"
      )
    ).toThrowError(Error);
  });
  it("resolves whatever is in fileRequestQueue if file name and fileRequestID are specified", () => {
    onParentContextFileRequestSuccess("content", "tests", "testKey");
    expect(resolveMock).toHaveBeenCalledTimes(1);
    expect(fileRequestQueue.tests.requests.testKey).toBe(undefined);
  });
  it("rejects whatever is in fileRequestQueue if file name and fileRequestID are specified", () => {
    onParentContextFileRequestError("content", "tests", "testKey");
    expect(rejectMock).toHaveBeenCalledTimes(1);
    expect(fileRequestQueue.tests.requests.testKey).toBe(undefined);
  });
});

describe("sendFileRequestToEditor integration tests", () => {
  beforeEach(() => {
    Object.keys(fileRequestQueue).forEach(k => {
      delete fileRequestQueue[k];
    });
  });
  it("throws errors if you pass in the wrong kind of object", () => {
    expect(() => sendFileRequestToEditor()).toThrow();
    expect(() => sendFileRequestToEditor("filename")).toThrowError();
    expect(() =>
      sendFileRequestToEditor("filename", "LOAD_FILE")
    ).toThrowError();
    expect(() =>
      sendFileRequestToEditor("filename", "LOAD_FILE", "SHOULD_BE_FUNCTION")
    ).toThrow();
  });
  it("returns a Promise that resolves when resolve is called", async () => {
    const FIRST_FILE = "tf1";
    const fileRequest = sendFileRequestToEditor(
      FIRST_FILE,
      "SAVE_FILE",
      () => {}
    );
    // get key
    const key = Object.keys(fileRequestQueue[FIRST_FILE].requests)[0];
    onParentContextFileRequestSuccess(undefined, FIRST_FILE, key);
    return expect(fileRequest).resolves.toBe(undefined);
  });
  it("returns a Promise that rejects when reject is called", async () => {
    const FIRST_FILE = "tf1";
    const fileRequest = sendFileRequestToEditor(
      FIRST_FILE,
      "SAVE_FILE",
      () => {}
    );
    // get key
    setTimeout(() => {
      const key = Object.keys(fileRequestQueue);
      console.log(fileRequestQueue, "!!!!!");
    }, 10);
    jest.runAllTimers();
    const key = Object.keys(fileRequestQueue[FIRST_FILE].requests)[0];
    onParentContextFileRequestError("error", FIRST_FILE, key);
    return expect(fileRequest).rejects.toThrowError();
  });
  it("properly enqueues multiple file requests", async () => {
    const FIRST_FILE = "tf1";
    const SECOND_FILE = "tf2";
    const fileRequest1 = sendFileRequestToEditor(
      FIRST_FILE,
      "SAVE_FILE",
      () => {}
    );
    const key1 = Object.keys(fileRequestQueue[FIRST_FILE].requests)[0];
    expect(Object.keys(fileRequestQueue).length).toBe(1);
    const fileRequest2 = sendFileRequestToEditor(
      SECOND_FILE,
      "SAVE_FILE",
      () => {}
    );
    expect(Object.keys(fileRequestQueue).length).toBe(2);
    onParentContextFileRequestSuccess(undefined, FIRST_FILE, key1);
    const key2 = Object.keys(fileRequestQueue[SECOND_FILE].requests)[0];
    onParentContextFileRequestSuccess("some-value", SECOND_FILE, key2);
    return Promise.all([
      expect(fileRequest1).resolves.toBe(undefined),
      expect(fileRequest2).resolves.toBe("some-value")
    ]);
  });
});
