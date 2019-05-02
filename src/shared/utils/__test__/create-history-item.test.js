import createHistoryItem from "../create-history-item";

describe("createHistoryItem", () => {
  it("creates a new history item and fills in a random ID if no historyId is provided", () => {
    const h = createHistoryItem({
      content: "content",
      historyType: "CELL_EVAL_VALUE"
    });
    expect(typeof h.historyId).toBe("string");
    expect(Object.keys(h).length).toBe(3);
  });
  it("creates a new history item but maintains the passed-in historyId", () => {
    const historyId = "a9vndos8";
    const h = createHistoryItem({
      content: "content",
      historyType: "CELL_EVAL_VALUE",
      historyId
    });
    expect(h.historyId).toBe(historyId);
    expect(Object.keys(h).length).toBe(3);
  });
});
