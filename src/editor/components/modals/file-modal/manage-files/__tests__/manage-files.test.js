import { mapStateToProps } from "../manage-files";
import FileList from "../file-list";

describe("file-modal/index.jsx", () => {
  let state;

  beforeEach(() => {
    state = {
      notebookInfo: {
        max_file_size: 10485760,
        max_filename_length: 120,
        notebook_id: 15,
        files: [
          {
            filename: "example1.jpg",
            id: 215,
            lastUpdated: "2019-06-08T00:16:54.296040+00:00"
          },
          {
            filename: "example2.jpg",
            id: 321,
            lastUpdated: "2019-06-08T00:16:54.272412+00:00"
          },
          {
            filename: "example3.jpg",
            id: 892,
            lastUpdated: "2019-06-07T22:43:34.860605+00:00"
          }
        ]
      }
    };
  });

  it("mapStateToProps", () => {
    expect(mapStateToProps(state)).toEqual({
      maxFileSize: state.notebookInfo.max_file_size,
      maxFileSizeMB: 10,
      maxFilenameLength: state.notebookInfo.max_filename_length,
      notebookID: 15,
      savedFiles: state.notebookInfo.files
    });
  });
});

describe("file-modal/file-list.jsx", () => {
  let props;
  let fileList;

  beforeEach(() => {
    props = {
      files: [
        {
          id: 162,
          filename: "example3.jpg",
          status: "saved"
        },
        {
          id: 202,
          filename: "example1.jpg",
          status: "deleted"
        },
        {
          id: 462,
          filename: "example10.jpg",
          status: "deleted"
        },
        {
          id: 920,
          filename: "example2.jpg",
          status: "uploading"
        }
      ]
    };

    fileList = new FileList(props);
  });

  it("getSortedFileEntries", () => {
    expect(fileList.getSortedFileEntries()).toEqual([
      { id: 202, filename: "example1.jpg", status: "deleted" },
      { id: 920, filename: "example2.jpg", status: "uploading" },
      { id: 162, filename: "example3.jpg", status: "saved" },
      { id: 462, filename: "example10.jpg", status: "deleted" }
    ]);
  });
});
