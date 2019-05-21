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
      name: "updateNotebookRequest no parent revision id",
      fn: updateNotebookRequest,
      args: [1, undefined, "title", "content"],
      expectedPostBody: { title: "title", content: "content" },
      jsonResponseExpected: true
    },
    {
      name: "updateNotebookRequest w/ parent revision id",
      fn: updateNotebookRequest,
      args: [1, 1, "title", "content"],
      expectedPostBody: {
        title: "title",
        content: "content",
        parent_revision_id: 1
      },
      jsonResponseExpected: true
    },
    { fn: deleteNotebookRequest, args: [1], jsonResponseExpected: false },
    {
      fn: deleteNotebookRevisionRequest,
      args: [1, 1],
      jsonResponseExpected: false
    }
  ].forEach(test => {
    it(`${test.name ? test.name : test.fn.name} success`, async () => {
      const expectedResponse = { foo: 1 };
      if (test.jsonResponseExpected) {
        fetch.mockResponseOnce(JSON.stringify(expectedResponse));
        await expect(test.fn(...test.args)).resolves.toEqual(expectedResponse);
      } else {
        fetch.mockResponseOnce("ok");
        await expect(test.fn(...test.args)).resolves.toEqual("ok");
      }
      if (test.expectedPostBody) {
        expect(fetch.mock.calls[0][1].body).toEqual(
          JSON.stringify(test.expectedPostBody)
        );
      }
    });

    // iterate through a variety of failure scenarios
    [
      {
        errorCode: 400,
        response: { detail: "Insufficient cats" },
        expectedMessage: "Bad Request",
        expectedStatus: "BAD_REQUEST",
        expectedDetail: "Insufficient cats"
      },
      {
        errorCode: 403,
        response: ["Bad permissions"],
        expectedMessage: "Forbidden",
        expectedStatus: "FORBIDDEN",
        expectedDetail: ["Bad permissions"]
      },
      {
        errorCode: 500,
        response: { detail: "Some horrible thing" },
        expectedMessage: "Internal Server Error",
        expectedStatus: "UNKNOWN_ERROR",
        expectedDetail: "Some horrible thing"
      }
    ].forEach(testFailure => {
      it(`${test.fn.name} fail - ${
        testFailure.errorCode
      } return code`, async () => {
        fetch.mockResponseOnce(JSON.stringify(testFailure.response), {
          status: testFailure.errorCode
        });
        return test.fn(...test.args).catch(e => {
          expect(e.message).toEqual(testFailure.expectedMessage);
          expect(e.status).toEqual(testFailure.expectedStatus);
          expect(e.detail).toEqual(testFailure.expectedDetail);
        });
      });
    });
  });
});
