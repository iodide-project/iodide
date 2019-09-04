import { ManageFilesUnconnected, mapStateToProps } from "../manage-files";
import Body from "../body";
import FileList from "../file-list";

describe("file-modal/index.jsx", () => {
  let fmu;
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
      },

      // Remember that ManageFilesUnconnected uses its own keys which are not
      // related to notebookInfo IDs.
      files: {
        "0": {
          id: 215,
          name: "example1.jpg",
          status: "saved"
        },
        "1": {
          id: 321,
          name: "example2.jpg",
          status: "uploading"
        },
        "2": {
          id: 892,
          name: "example3.jpg",
          status: "saved"
        }
      }
    };

    fmu = new ManageFilesUnconnected(mapStateToProps(state));
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

  it("getFilesStateCopy", () => {
    const newFiles = fmu.getFilesStateCopy(state);

    delete newFiles[0];
    newFiles[3] = { name: "example4.jpg", status: "saved", id: 979 };

    expect(state.files[0]).not.toBeUndefined();
    expect(state.files[3]).toBeUndefined();
  });

  describe("getNewFileKey", () => {
    // Use a fresh ManageFilesUnconnected with no savedFiles to ensure that the
    // constructor never calls getNewFileKey
    const fmu2 = new ManageFilesUnconnected({
      savedFiles: []
    });

    it("First key is 0", () => {
      expect(fmu2.getNewFileKey()).toEqual(0);
    });

    it("Successive keys are incremented", () => {
      expect(fmu2.getNewFileKey()).toEqual(1);
      expect(fmu2.getNewFileKey()).toEqual(2);
      expect(fmu2.getNewFileKey()).toEqual(3);
    });
  });

  it("getSavedFileKey", () => {
    expect(fmu.getSavedFileKey("example1.jpg")).toEqual("0");
    expect(fmu.getSavedFileKey("example2.jpg")).toEqual("1");
    expect(fmu.getSavedFileKey("example3.jpg")).toEqual("2");
    expect(fmu.getSavedFileKey("example9.jpg")).toBeUndefined();
  });

  it("getSavedFileID", () => {
    expect(fmu.getSavedFileID("0")).toEqual(215);
    expect(fmu.getSavedFileID("1")).toEqual(321);
    expect(fmu.getSavedFileID("2")).toEqual(892);
    expect(fmu.getSavedFileID("99")).toBeUndefined();
  });

  describe("deleteUpdater", () => {
    beforeEach(() => {
      state.pendingDelete = {
        id: 215,
        name: "example1.jpg",
        fileKey: 0
      };
    });

    it("Sets status to deleted", () => {
      expect(fmu.deleteUpdater(state)).toMatchObject({
        files: {
          "0": {
            id: 215,
            name: "example1.jpg",
            status: "deleted"
          },
          "1": {
            id: 321,
            name: "example2.jpg",
            status: "uploading"
          },
          "2": {
            id: 892,
            name: "example3.jpg",
            status: "saved"
          }
        },
        pendingDelete: false
      });
    });

    it("Does not mutate global state", () => {
      expect(state.files[0].status).toEqual("saved");
    });
  });

  describe("fileTooBigUpdater", () => {
    it('Adds file with "error" status and error message', () => {
      expect(
        fmu.fileTooBigUpdater(state, { name: "example4.jpg" })
      ).toMatchObject({
        files: {
          "0": {
            id: 215,
            name: "example1.jpg",
            status: "saved"
          },
          "1": {
            id: 321,
            name: "example2.jpg",
            status: "uploading"
          },
          "2": {
            id: 892,
            name: "example3.jpg",
            status: "saved"
          },
          "3": {
            name: "example4.jpg",
            status: "error",
            errorMessage: "File exceeds maximum size of 10MB"
          }
        }
      });
    });

    it("Does not mutate global state", () => {
      expect(state.files[3]).toBeUndefined();
    });
  });

  describe("filenameTooLongUpdater", () => {
    it('Adds file with "error" status and error message', () => {
      expect(
        fmu.filenameTooLongUpdater(state, { name: "example4.jpg" })
      ).toMatchObject({
        files: {
          "0": {
            id: 215,
            name: "example1.jpg",
            status: "saved"
          },
          "1": {
            id: 321,
            name: "example2.jpg",
            status: "uploading"
          },
          "2": {
            id: 892,
            name: "example3.jpg",
            status: "saved"
          },
          "3": {
            name: "example4.jpg",
            status: "error",
            errorMessage: "Filename exceeds maximum length of 120 characters"
          }
        }
      });
    });

    it("Does not mutate global state", () => {
      expect(state.files[3]).toBeUndefined();
    });
  });

  describe("fileUploadBeganUpdater", () => {
    it('Adds file with "uploading" status', () => {
      expect(
        fmu.fileUploadBeganUpdater(state, 3, "example4.jpg")
      ).toMatchObject({
        files: {
          "0": {
            id: 215,
            name: "example1.jpg",
            status: "saved"
          },
          "1": {
            id: 321,
            name: "example2.jpg",
            status: "uploading"
          },
          "2": {
            id: 892,
            name: "example3.jpg",
            status: "saved"
          },
          "3": {
            name: "example4.jpg",
            status: "uploading"
          }
        }
      });
    });

    it("Does not mutate global state", () => {
      expect(state.files[3]).toBeUndefined();
    });
  });

  describe("fileSavedUpdater", () => {
    it('Adds file with "saved" status', () => {
      const stateUpdate = fmu.fileUploadBeganUpdater(state, 3, "example4.jpg");
      expect(
        fmu.fileSavedUpdater(Object.assign({}, state, stateUpdate), 3)
      ).toMatchObject({
        files: {
          "0": {
            id: 215,
            name: "example1.jpg",
            status: "saved"
          },
          "1": {
            id: 321,
            name: "example2.jpg",
            status: "uploading"
          },
          "2": {
            id: 892,
            name: "example3.jpg",
            status: "saved"
          },
          "3": {
            name: "example4.jpg",
            status: "saved"
          }
        }
      });
    });

    it("Does not mutate global state", () => {
      expect(state.files[3]).toBeUndefined();
    });
  });

  describe("fileErroredUpdater", () => {
    it('Adds file with "error" status and error message', () => {
      const stateUpdate = fmu.fileUploadBeganUpdater(state, 3, "example4.jpg");
      expect(
        fmu.fileErroredUpdater(
          Object.assign({}, state, stateUpdate),
          3,
          "Some funny string in the test file"
        )
      ).toMatchObject({
        files: {
          "0": {
            id: 215,
            name: "example1.jpg",
            status: "saved"
          },
          "1": {
            id: 321,
            name: "example2.jpg",
            status: "uploading"
          },
          "2": {
            id: 892,
            name: "example3.jpg",
            status: "saved"
          },
          "3": {
            name: "example4.jpg",
            status: "error",
            errorMessage: "Some funny string in the test file"
          }
        }
      });
    });

    it("Does not mutate global state", () => {
      expect(state.files[3]).toBeUndefined();
    });
  });

  describe("confirmOverwriteUpdater", () => {
    beforeEach(() => {
      state.pendingOverwrites = [
        {
          name: "example1.jpg",
          existingFileKey: "0",
          existingFileID: 215
        },
        {
          name: "example2.jpg",
          existingFileKey: "1",
          existingFileID: 321
        }
      ];
    });

    it("Adds object to pendingOverwrites state", () => {
      expect(
        fmu.confirmOverwriteUpdater(
          state,
          new FormData(),
          "example3.jpg",
          "2",
          892
        )
      ).toMatchObject({
        pendingOverwrites: [
          {
            name: "example1.jpg",
            existingFileKey: "0",
            existingFileID: 215
          },
          {
            name: "example2.jpg",
            existingFileKey: "1",
            existingFileID: 321
          },
          {
            name: "example3.jpg",
            existingFileKey: "2",
            existingFileID: 892
          }
        ]
      });
    });

    it("Does not mutate global state", () => {
      expect(
        state.pendingOverwrites.some(po => po.name === "example3.jpg")
      ).not.toBeTruthy();
      expect(
        state.pendingOverwrites.some(po => po.existingFileKey === 3)
      ).not.toBeTruthy();
    });
  });

  describe("hideOverwriteModalUpdater", () => {
    beforeEach(() => {
      state.pendingOverwrites = [
        {
          id: 215,
          name: "example1.jpg",
          existingFileKey: 0
        },
        {
          id: 321,
          name: "example2.jpg",
          existingFileKey: 1
        }
      ];
    });

    it("Removes object from pendingOverwrites state", () => {
      expect(
        fmu.hideOverwriteModalUpdater(state, "example2.jpg")
      ).toMatchObject({
        pendingOverwrites: [
          {
            id: 215,
            name: "example1.jpg",
            existingFileKey: 0
          }
        ]
      });
    });

    it("Does not mutate global state", () => {
      expect(
        state.pendingOverwrites.some(po => {
          return po.name === "example2.jpg" && po.existingFileKey === 1;
        })
      ).toBeTruthy();
    });
  });
});

describe("file-modal/body.jsx", () => {
  describe("hasVisibleFiles", () => {
    it('When all files are "deleted"', () => {
      const props = {
        files: {
          "0": {
            id: 215,
            name: "example1.jpg",
            status: "deleted"
          },
          "1": {
            id: 321,
            name: "examplej.jpg",
            status: "deleted"
          },
          "2": {
            id: 892,
            name: "example3.jpg",
            status: "deleted"
          }
        }
      };
      const body = new Body(props);
      expect(body.hasVisibleFiles()).not.toBeTruthy();
    });

    it('When one file is "uploading"', () => {
      const props = {
        files: {
          "0": {
            id: 215,
            name: "example1.jpg",
            status: "deleted"
          },
          "1": {
            id: 321,
            name: "example2.jpg",
            status: "uploading"
          },
          "2": {
            id: 892,
            name: "example3.jpg",
            status: "deleted"
          }
        }
      };
      const body = new Body(props);
      expect(body.hasVisibleFiles()).toBeTruthy();
    });

    it('When one file is "errored"', () => {
      const props = {
        files: {
          "0": {
            id: 215,
            name: "example1.jpg",
            status: "deleted"
          },
          "1": {
            id: 321,
            name: "example2.jpg",
            status: "error"
          },
          "2": {
            id: 892,
            name: "example3.jpg",
            status: "deleted"
          }
        }
      };
      const body = new Body(props);
      expect(body.hasVisibleFiles()).toBeTruthy();
    });

    it('When one file is "saved"', () => {
      const props = {
        files: {
          "0": {
            id: 215,
            name: "example1.jpg",
            status: "deleted"
          },
          "1": {
            id: 321,
            name: "example2.jpg",
            status: "saved"
          },
          "2": {
            id: 892,
            name: "example3.jpg",
            status: "deleted"
          }
        }
      };
      const body = new Body(props);
      expect(body.hasVisibleFiles()).toBeTruthy();
    });

    it('When all files are "saved"', () => {
      const props = {
        files: {
          "0": {
            id: 215,
            name: "example1.jpg",
            status: "saved"
          },
          "1": {
            id: 321,
            name: "example2.jpg",
            status: "saved"
          },
          "2": {
            id: 892,
            name: "example3.jpg",
            status: "saved"
          }
        }
      };
      const body = new Body(props);
      expect(body.hasVisibleFiles()).toBeTruthy();
    });
  });
});

describe("file-modal/file-list.jsx", () => {
  let props;
  let fileList;

  beforeEach(() => {
    props = {
      files: {
        "15": {
          id: 162,
          name: "example3.jpg",
          status: "saved"
        },
        "95": {
          id: 202,
          name: "example1.jpg",
          status: "deleted"
        },
        "7": {
          id: 462,
          name: "example10.jpg",
          status: "deleted"
        },
        "32": {
          id: 920,
          name: "example2.jpg",
          status: "uploading"
        }
      }
    };

    fileList = new FileList(props);
  });

  it("getSortedFileEntries", () => {
    expect(fileList.getSortedFileEntries()).toEqual([
      ["95", { id: 202, name: "example1.jpg", status: "deleted" }],
      ["32", { id: 920, name: "example2.jpg", status: "uploading" }],
      ["15", { id: 162, name: "example3.jpg", status: "saved" }],
      ["7", { id: 462, name: "example10.jpg", status: "deleted" }]
    ]);
  });

  it("getFirstVisibleFileKey", () => {
    expect(
      fileList.getFirstVisibleFileKey(fileList.getSortedFileEntries())
    ).toEqual("32");
  });

  it("getLastVisibleFileKey", () => {
    expect(
      fileList.getLastVisibleFileKey(fileList.getSortedFileEntries())
    ).toEqual("15");
  });
});
