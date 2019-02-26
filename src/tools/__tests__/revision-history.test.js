import {
  getPreviousRevisionId,
  getRevisionIdsNeededForDisplay
} from "../revision-history";

describe("getPreviousRevisionId", () => {
  it("works when the autosaved revision is selected", () => {
    expect(getPreviousRevisionId([{ id: 2 }, { id: 3 }], undefined)).toBe(2);
  });
  it("works when there is a previous revision (not autosaved)", () => {
    expect(getPreviousRevisionId([{ id: 2 }, { id: 3 }], 2)).toBe(3);
  });
  it("returns undefined when there is no previous revision", () => {
    expect(getPreviousRevisionId([{ id: 2 }, { id: 3 }], 3)).toBe(undefined);
  });
});

describe("getRevisionIdsNeededForDisplay", () => {
  it("works when autosave revision selected", () => {
    expect(
      getRevisionIdsNeededForDisplay({
        revisionList: [{ id: 2 }],
        selectedRevisionId: undefined,
        revisionContent: {}
      })
    ).toEqual([2]);
    expect(
      getRevisionIdsNeededForDisplay({
        revisionList: [{ id: 2 }, { id: 3 }],
        selectedRevisionId: undefined,
        revisionContent: {}
      })
    ).toEqual([2]);
  });
  it("works when a specific revision selected", () => {
    expect(
      getRevisionIdsNeededForDisplay({
        revisionList: [{ id: 2 }, { id: 3 }],
        selectedRevisionId: 2,
        revisionContent: {}
      })
    ).toEqual([2, 3]);
    expect(
      getRevisionIdsNeededForDisplay({
        revisionList: [{ id: 2 }, { id: 3 }],
        selectedRevisionId: 3,
        revisionContent: {}
      })
    ).toEqual([3]);
  });
});
