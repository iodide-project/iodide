import { mapStateToProps } from "../file-source-list";

const hasntRunYet = {
  // hasn't run
  filename: "hasntRunYet",
  id: 0,
  url: "https://whatever.com/api",
  update_interval: "never",
  latest_file_update_operation: {}
};

const currentlyRunning = {
  // hasn't run
  filename: "ranAndFailed",
  id: 1,
  url: "https://whatever.com/api",
  update_interval: "never",
  latest_file_update_operation: {
    status: "running",
    started: "2019-07-08"
  }
};

const finishedRunning = {
  filename: "finishedRunning",
  id: 2,
  url: "https://whatever.com/api",
  update_interval: "never",
  latest_file_update_operation: {
    status: "complete",
    started: "2019-07-08"
  }
};

describe("FileSourceList mapStateToProps", () => {
  it("maps to a currently-running file source", () => {
    const {
      fileSources: [fs]
    } = mapStateToProps({
      fileSources: [currentlyRunning]
    });
    expect(fs.id).toBe(currentlyRunning.id);
    expect(fs.filename).toBe(currentlyRunning.filename);
    expect(fs.url).toBe(currentlyRunning.url);
    expect(fs.updateInterval).toBe(currentlyRunning.update_interval);
    expect(fs.lastUpdated).toBe(
      currentlyRunning.latest_file_update_operation.started
    );
    expect(fs.latestFileUpdateOperationStatus).toBe(
      currentlyRunning.latest_file_update_operation.status
    );
    expect(fs.isCurrentlyRunning).toBe(true);
    expect(fs.hasBeenRun).toBe(true);
  });

  it("maps to an unrun file source", () => {
    const {
      fileSources: [fs]
    } = mapStateToProps({
      fileSources: [hasntRunYet]
    });
    expect(fs.id).toBe(hasntRunYet.id);
    expect(fs.filename).toBe(hasntRunYet.filename);
    expect(fs.url).toBe(hasntRunYet.url);
    expect(fs.updateInterval).toBe(hasntRunYet.update_interval);
    expect(fs.lastUpdated).toBe(undefined);
    expect(fs.latestFileUpdateOperationStatus).toBe(undefined);
    expect(fs.isCurrentlyRunning).toBe(false);
    expect(fs.hasBeenRun).toBe(false);
  });

  it("maps to an finished-running file source", () => {
    const {
      fileSources: [fs]
    } = mapStateToProps({
      fileSources: [finishedRunning]
    });
    expect(fs.id).toBe(finishedRunning.id);
    expect(fs.filename).toBe(finishedRunning.filename);
    expect(fs.url).toBe(finishedRunning.url);
    expect(fs.updateInterval).toBe(finishedRunning.update_interval);
    expect(fs.lastUpdated).toBe(
      finishedRunning.latest_file_update_operation.started
    );
    expect(fs.latestFileUpdateOperationStatus).toBe(
      finishedRunning.latest_file_update_operation.status
    );
    expect(fs.isCurrentlyRunning).toBe(false);
    expect(fs.hasBeenRun).toBe(true);
  });
});
