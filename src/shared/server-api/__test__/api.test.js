import {
  createFileRequest,
  updateFileRequest,
  deleteFileRequest
} from "../file";

import {
  createNotebookRequest,
  updateNotebookRequest,
  deleteNotebookRequest,
  deleteNotebookRevisionRequest
} from "../notebook";

describe("file api methods", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  [
    { fn: createFileRequest, args: [{ foo: 1 }], jsonResponseExpected: true },
    {
      fn: updateFileRequest,
      args: [1, { foo: 1 }],
      jsonResponseExpected: true
    },
    { fn: deleteFileRequest, args: [1], jsonResponseExpected: false },
    {
      fn: createNotebookRequest,
      args: ["title", "content"],
      jsonResponseExpected: true
    },
    {
      fn: updateNotebookRequest,
      args: [1, "title", "content"],
      jsonResponseExpected: true
    },
    { fn: deleteNotebookRequest, args: [1], jsonResponseExpected: false },
    {
      fn: deleteNotebookRevisionRequest,
      args: [1, 1],
      jsonResponseExpected: false
    }
  ].forEach(test => {
    it(`${test.fn.name} success`, async () => {
      const expectedResponse = { foo: 1 };
      if (test.jsonResponseExpected) {
        fetch.mockResponseOnce(JSON.stringify(expectedResponse));
        await expect(test.fn(...test.args)).resolves.toEqual(expectedResponse);
      } else {
        fetch.mockResponseOnce("ok");
        await expect(test.fn(...test.args)).resolves.toEqual("ok");
      }
    });

    it(`${test.fn.name} fail`, async () => {
      const expectedResponse = { error: 1 };
      fetch.mockResponseOnce(JSON.stringify(expectedResponse), { status: 400 });
      await expect(test.fn(...test.args)).rejects.toEqual(
        new Error("Bad Request")
      );
    });
  });
});
