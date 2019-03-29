import { mapStateToProps } from "../revision-diff";

describe("RevisionDiff mapStateToProps", () => {
  let state;
  let ownProps;

  beforeEach(() => {
    state = {
      jsmd: "Local",
      notebookHistory: {
        revisionList: [{ id: 3 }, { id: 2 }, { id: 1 }],
        revisionContent: {
          3: "Newest",
          2: "Middle",
          1: "Oldest"
        }
      }
    };
    ownProps = {};
  });
  [
    [
      "expected results when local changes selected",
      undefined,
      ["Newest", "Local"]
    ],
    ["expected results when newest revision selected", 3, ["Middle", "Newest"]],
    ["expected results when oldest revision selected", 1, ["", "Oldest"]]
  ].forEach(t => {
    const [testDescription, selectedRevisionId, expected] = t;
    it(testDescription, () => {
      state.notebookHistory.selectedRevisionId = selectedRevisionId;
      const {
        previousRevisionContent,
        currentRevisionContent
      } = mapStateToProps(state, ownProps);
      expect([previousRevisionContent, currentRevisionContent]).toEqual(
        expected
      );
    });
  });
});
