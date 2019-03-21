export const store = {
  getState() {
    return {
      notebookInfo: {
        files: [
          { filename: "file1.csv", id: 0, lastUpdated: "yesterday" },
          { filename: "file2.csv", id: 1, lastUpdated: "tomorrow" },
          { filename: "file3.csv", id: 2, lastUpdated: "never" }
        ]
      }
    };
  }
};
