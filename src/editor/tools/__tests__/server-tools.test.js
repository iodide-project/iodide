import {
  getConnectionMode,
  getNotebookID,
  getRevisionID,
  connectionModeIsStandalone,
  connectionModeIsServer,
  isLoggedIn
} from "../server-tools";

const makeState = connectionMode => ({
  notebookInfo: { connectionMode }
});

describe("getConnectionMode", () => {
  it("correctly reads connection mode", () => {
    const standalone = makeState("STANDALONE");
    const server = makeState("SERVER");
    expect(getConnectionMode(standalone)).toBe("STANDALONE");
    expect(getConnectionMode(server)).toBe("SERVER");
  });
  it("throws if state.notebookInfo.connectionMode does not exist", () => {
    const malform = { notebookInfo: {} };
    expect(() => getConnectionMode(malform)).toThrow();
  });
});

describe("connectionModeIsStandalone && connectionModeIsServer", () => {
  it('returns true if connectionMode == "STANDALONE"', () => {
    const standalone = makeState("STANDALONE");
    const server = makeState("SERVER");
    expect(connectionModeIsStandalone(standalone)).toBeTruthy();
    expect(connectionModeIsStandalone(server)).toBeFalsy();
    expect(connectionModeIsServer(standalone)).toBeFalsy();
    expect(connectionModeIsServer(server)).toBeTruthy();
  });
});

describe("getNotebookID && getRevisionID", () => {
  [
    [getNotebookID, "notebook_id"],
    [getRevisionID, "revision_id"]
  ].forEach(([fn, nbId]) => {
    it(`${fn.name} returns ${nbId} if one exists and one is on a server. Otherwise returns undefined.`, () => {
      const nb = makeState("SERVER");
      nb.notebookInfo[nbId] = 5;
      expect(fn(nb)).toBe(5);
      nb.notebookInfo[nbId] = undefined;
      expect(fn(nb)).toBe(undefined);
    });
    it(`${fn.name} returns undefined if the notebook is in standalone mode`, () => {
      // this is an edge case, but here
      // the identifier is still 5 in nb.notebookInfo, and we should still return undefined.
      const nb = makeState("STANDALONE");
      nb.notebookInfo[nbId] = 5;
      expect(fn(nb)).toBe(undefined);
    });
    it(`${fn.name} throws if state.notebookInfo.${nbId} is not an integer nor undefined`, () => {
      const nb = makeState("SERVER");
      nb.notebookInfo[nbId] = "some string";
      expect(() => fn(nb)).toThrow();
    });
  });
});

describe("isLoggedIn", () => {
  it("Says it is logged in when there is an identified user", () => {
    expect(isLoggedIn({ userData: { name: "user" } })).toEqual(true);
  });
  it("Says it is not logged in when there is no identified user or no user data", () => {
    expect(isLoggedIn({})).toEqual(false);
    expect(isLoggedIn({ userData: {} })).toEqual(false);
    expect(isLoggedIn({ userData: { name: undefined } })).toEqual(false);
  });
});
