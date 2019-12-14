import isArrayBuffer from "lodash/isArrayBuffer";

import { genericFetch } from "../fetch-tools";

describe("fetch raw data as correct type", () => {
  it("should convert arrayBuffer into bytes if fetch is `bytes`", async () => {
    const mockResponse = {
      arrayBuffer: () => new ArrayBuffer(8),
      ok: true
    };
    const mockFetch = () => Promise.resolve(mockResponse);
    jest.spyOn(global, "fetch").mockImplementationOnce(mockFetch);

    const data = await genericFetch("some-path", "bytes");

    expect(data.byteLength).toEqual(8);
    expect(isArrayBuffer(data.buffer)).toBe(true);
  });

  it("should fetch correctly if fetch is `arrayBuffer`", async () => {
    const mockResponse = {
      arrayBuffer: () => new ArrayBuffer(8),
      ok: true
    };
    const mockFetch = () => Promise.resolve(mockResponse);
    jest.spyOn(global, "fetch").mockImplementationOnce(mockFetch);

    const data = await genericFetch("some-path", "arrayBuffer");

    expect(data.byteLength).toEqual(8);
    expect(isArrayBuffer(data)).toBe(true);
  });

  const fetchTypes = [
    "css",
    "js",
    "json",
    "plugin",
    "text",
    "arrayBuffer",
    "blob",
    "bytes"
  ];
  fetchTypes.forEach(fetchType => {
    it(`should reject "${fetchType}" fetch promise if http response not ok`, async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: "Bad request"
      };
      const mockFetch = () => Promise.resolve(mockResponse);
      jest.spyOn(global, "fetch").mockImplementationOnce(mockFetch);

      const badPromise = genericFetch("some-path", fetchType);

      await expect(badPromise).rejects.toThrow("400 Bad request (some-path)");
    });
  });
});
