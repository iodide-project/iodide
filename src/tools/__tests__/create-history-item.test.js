import createHistoryItem from "../create-history-item";

describe("createHistoryItem", () => {
  it("creates a new history item and fills in a random ID if no historyId is provided", () => {
    const h = createHistoryItem({
      content: "content",
      historyType: "CELL_EVAL_VALUE"
    });
    expect(typeof h.historyId).toBe("string");
    expect(typeof h.lastRan).toBe("number");
    expect(Object.keys(h).length).toBe(4);
  });
  it("creates a new history item but maintains the passed-in historyId and lastRan", () => {
    const historyId = "a9vndos8";
    const lastRan = +new Date();
    const h = createHistoryItem({
      content: "content",
      historyType: "CELL_EVAL_VALUE",
      historyId,
      lastRan
    });
    expect(h.historyId).toBe(historyId);
    expect(h.lastRan).toEqual(lastRan);
    expect(Object.keys(h).length).toBe(4);
  });
});
