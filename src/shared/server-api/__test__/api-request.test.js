import { signedAPIRequestWithJSONContent } from "../api-request";

const apiRequest = require("../api-request");

describe("signedAPIRequest", () => {
  beforeEach(() => {
    fetch.resetMocks();

    // jest's cookie mock is (currently) incomplete so we need to override it
    apiRequest.setCookie = jest.fn((a, b) => {
      document.cookie = `${a}=${b}`;
    });

    // reset cookie state between tests
    document.cookie = "jwt-access-token=;expires=1 Jan 1970 00:00:00 GMT;";
    document.cookie = "jwt-refresh-token=;expires=1 Jan 1970 00:00:00 GMT;";
    document.cookie = "csrftoken=myfuncsrftoken";
  });

  it("attempts to get an API token if we don't have one yet", async () => {
    fetch.mockResponses(
      [JSON.stringify({ access: 1234, refresh: 4567 })],
      [JSON.stringify({ cheezburger: 1 })]
    );

    const res = await signedAPIRequestWithJSONContent("/foo/bar");
    expect(res).toEqual({ cheezburger: 1 });

    // validate that it sent a set of fetch calls that would have actually
    // succeeded
    expect(fetch.mock.calls).toEqual([
      [
        "/token/",
        { headers: { "X-CSRFToken": "myfuncsrftoken" }, method: "POST" }
      ],
      [
        "/foo/bar",
        {
          credentials: "omit",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer 1234",
            "Content-Type": "application/json"
          }
        }
      ]
    ]);

    // should have access tokens we can use for subsequent requests
    expect(document.cookie).toEqual(
      "csrftoken=myfuncsrftoken; jwt-access-token=1234; jwt-refresh-token=4567"
    );
  });

  it("attempts to get a new API token with a refresh token if we have one", async () => {
    document.cookie = `jwt-refresh-token=1234`;
    fetch.mockResponses(
      [JSON.stringify({ access: 4567 })],
      [JSON.stringify({ cheezburger: 1 })]
    );
    const res = await signedAPIRequestWithJSONContent("/foo/bar");
    expect(res).toEqual({ cheezburger: 1 });

    // validate that it sent a set of fetch calls that would have actually
    // succeeded
    expect(fetch.mock.calls).toEqual([
      [
        "/api/v1/token/refresh/",
        {
          body: JSON.stringify({ refresh: "1234" }),
          headers: { "Content-Type": "application/json" },
          method: "POST"
        }
      ],
      [
        "/foo/bar",
        {
          credentials: "omit",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer 4567",
            "Content-Type": "application/json"
          }
        }
      ]
    ]);

    // should have access tokens we can use for subsequent requests
    expect(document.cookie).toEqual(
      "csrftoken=myfuncsrftoken; jwt-refresh-token=1234; jwt-access-token=4567"
    );
  });

  it("falls back to get a fresh API token if using the refresh token fails", async () => {
    document.cookie = `jwt-refresh-token=8910`;
    fetch.mockResponses(
      [JSON.stringify({ error: "too many cats" }), { status: 400 }],
      [JSON.stringify({ access: 1234, refresh: 4567 })],
      [JSON.stringify({ cheezburger: 1 })]
    );
    const res = await signedAPIRequestWithJSONContent("/foo/bar");
    expect(res).toEqual({ cheezburger: 1 });

    // validate that it sent a set of fetch calls that would have actually
    // succeeded
    expect(fetch.mock.calls).toEqual([
      [
        "/api/v1/token/refresh/",
        {
          body: JSON.stringify({ refresh: "8910" }),
          headers: { "Content-Type": "application/json" },
          method: "POST"
        }
      ],
      [
        "/token/",
        { headers: { "X-CSRFToken": "myfuncsrftoken" }, method: "POST" }
      ],
      [
        "/foo/bar",
        {
          credentials: "omit",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer 1234",
            "Content-Type": "application/json"
          }
        }
      ]
    ]);

    // should have access tokens we can use for subsequent requests
    expect(document.cookie).toEqual(
      "csrftoken=myfuncsrftoken; jwt-refresh-token=4567; jwt-access-token=1234"
    );
  });
});
