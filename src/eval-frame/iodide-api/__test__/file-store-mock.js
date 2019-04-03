export const store = {
  getState() {
    return {
      notebookInfo: {
        files: [
          {
            filename: "file1.csv",
            id: 0,
            lastUpdated: "2019-04-03T16:51:45.075609+00:00"
          },
          {
            filename: "file2.csv",
            id: 1,
            lastUpdated: "2019-04-01T14:51:00.075609+00:00"
          },
          {
            filename: "file3.csv",
            id: 2,
            lastUpdated: "2019-03-29T22:22:12.075609+00:00"
          }
        ]
      }
    };
  }
};
