import sendFileRequestToEditor, {
  onParentContextFileRequestSuccess,
  onParentContextFileRequestError,
  fileRequests
} from "../send-file-request-to-editor";

jest.useFakeTimers();

describe("onParentContextFileRequestSuccess / onParentContextFileRequestError", () => {
  let resolveMock;
  let rejectMock;
  beforeEach(() => {
    Object.keys(fileRequests).forEach(k => {
      delete fileRequests[k];
    });
    resolveMock = jest.fn();
    rejectMock = jest.fn();
    fileRequests.tests = { resolve: resolveMock, reject: rejectMock };
  });
  it("resolves whatever is in fileRequestQueue if file name and fileRequestID are specified", () => {
    onParentContextFileRequestSuccess("content", "tests", "testKey");
    expect(resolveMock).toHaveBeenCalledTimes(1);
    expect(fileRequests.tests).toBe(undefined);
  });
  it("rejects whatever is in fileRequestQueue if file name and fileRequestID are specified", () => {
    onParentContextFileRequestError("content", "tests", "testKey");
    expect(rejectMock).toHaveBeenCalledTimes(1);
    expect(fileRequests.tests).toBe(undefined);
  });
});

describe("sendFileRequestToEditor integration tests", () => {
  beforeEach(() => {
    Object.keys(fileRequests).forEach(k => {
      delete fileRequests[k];
    });
  });
  it("returns a Promise that resolves to value when onParentContextFileRequestSuccess is called", async () => {
    const FIRST_FILE = "tf1";
    const fileRequestID = "some-id";
    const request = sendFileRequestToEditor(
      FIRST_FILE,
      "LOAD_FILE",
      {},
      fileRequestID
    );
    jest.runAllTicks();
    onParentContextFileRequestSuccess("test-contents", fileRequestID);
    return expect(request).resolves.toBe("test-contents");
  });
  it("returns a Promise that resolves to the error message when onParentContextFileRequestError is called", async () => {
    const FIRST_FILE = "tf1";
    const fileRequestID = "another-id";
    const request = sendFileRequestToEditor(
      FIRST_FILE,
      "SAVE_FILE",
      {},
      fileRequestID
    );
    jest.runAllTicks();
    onParentContextFileRequestError("error-message", fileRequestID);
    return expect(request).rejects.toBe("error-message");
  });
});
