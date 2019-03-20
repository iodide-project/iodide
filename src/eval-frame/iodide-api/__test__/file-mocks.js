export const store = {
  getState() {
    return {
      notebookInfo: {
        files: [
          { name: "file1.csv" },
          { name: "file2.csv" },
          { name: "file3.csv" }
        ]
      }
    };
  }
};
