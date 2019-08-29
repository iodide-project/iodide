import { mapStateToProps } from "../file-source-list-item";
import { timeMonthDayYear } from "../../../../../../shared/date-formatters";

const hasntRunYet = {
  // hasn't run
  filename: "hasntRunYet",
  id: 0,
  url: "https://whatever.com/api",
  update_interval: "never",
  latest_file_update_operation: {}
};

const currentlyRunning = {
  filename: "ranAndFailed",
  id: 1,
  url: "https://whatever.com/api",
  update_interval: "never",
  latest_file_update_operation: {
    status: "running",
    started_at: "2019-07-08"
  }
};

const finishedRunning = {
  filename: "finishedRunning",
  id: 2,
  url: "https://whatever.com/api",
  update_interval: "never",
  latest_file_update_operation: {
    status: "complete",
    started_at: "2019-07-08"
  }
};

const failed = {
  filename: "failure",
  id: 3,
  url: "https://whatever.com/api",
  update_interval: "never",
  latest_file_update_operation: {
    status: "failed",
    started_at: "2019-07-08",
    failure_reason: "failure reason goes here"
  }
};

const makeState = (...sources) => {
  return {
    fileSources: { sources, confirmDeleteID: 3, isDeletingAnimationID: 3 }
  };
};

describe("FileSourceList mapStateToProps", () => {
  it("maps to a currently-running file source", () => {
    const fs = mapStateToProps(makeState(currentlyRunning), {
      id: currentlyRunning.id
    });
    expect(fs.id).toBe(currentlyRunning.id);
    expect(fs.filename).toBe(currentlyRunning.filename);
    expect(fs.url).toBe(currentlyRunning.url);
    expect(fs.updateInterval).toBe(currentlyRunning.update_interval);
    expect(fs.lastUpdated).toBe(
      timeMonthDayYear(currentlyRunning.latest_file_update_operation.started_at)
    );
    expect(fs.latestFileUpdateOperationStatus).toBe(
      currentlyRunning.latest_file_update_operation.status
    );
    expect(fs.isCurrentlyRunning).toBe(true);
    expect(fs.hasBeenRun).toBe(true);
    expect(fs.failureReason).toBeUndefined();
    expect(fs.showFailureReason).toBe(false);
  });

  it("maps to an unrun file source", () => {
    const fs = mapStateToProps(makeState(hasntRunYet), { id: hasntRunYet.id });
    expect(fs.id).toBe(hasntRunYet.id);
    expect(fs.filename).toBe(hasntRunYet.filename);
    expect(fs.url).toBe(hasntRunYet.url);
    expect(fs.updateInterval).toBe(hasntRunYet.update_interval);
    expect(fs.lastUpdated).toBe(undefined);
    expect(fs.latestFileUpdateOperationStatus).toBe(undefined);
    expect(fs.isCurrentlyRunning).toBe(false);
    expect(fs.hasBeenRun).toBe(false);
    expect(fs.failureReason).toBeUndefined();
    expect(fs.showFailureReason).toBe(false);
  });

  it("maps to an finished-running file source", () => {
    const fs = mapStateToProps(makeState(finishedRunning), {
      id: finishedRunning.id
    });
    expect(fs.id).toBe(finishedRunning.id);
    expect(fs.filename).toBe(finishedRunning.filename);
    expect(fs.url).toBe(finishedRunning.url);
    expect(fs.updateInterval).toBe(finishedRunning.update_interval);
    expect(fs.lastUpdated).toBe(
      timeMonthDayYear(finishedRunning.latest_file_update_operation.started_at)
    );
    expect(fs.latestFileUpdateOperationStatus).toBe(
      finishedRunning.latest_file_update_operation.status
    );
    expect(fs.isCurrentlyRunning).toBe(false);
    expect(fs.hasBeenRun).toBe(true);
    expect(fs.failureReason).toBeUndefined();
    expect(fs.showFailureReason).toBe(false);
  });

  it("maps to an finished-running file source", () => {
    const fs = mapStateToProps(makeState(failed), { id: failed.id });
    expect(fs.id).toBe(failed.id);
    expect(fs.filename).toBe(failed.filename);
    expect(fs.url).toBe(failed.url);
    expect(fs.updateInterval).toBe(failed.update_interval);
    expect(fs.lastUpdated).toBe(
      timeMonthDayYear(failed.latest_file_update_operation.started_at)
    );
    expect(fs.latestFileUpdateOperationStatus).toBe(
      failed.latest_file_update_operation.status
    );
    expect(fs.isCurrentlyRunning).toBe(false);
    expect(fs.hasBeenRun).toBe(true);
    expect(fs.failureReason).toBe(
      failed.latest_file_update_operation.failure_reason
    );
    expect(fs.showFailureReason).toBe(true);
  });

  it("marks a file source for deletion confirmation", () => {
    const fs = mapStateToProps(makeState(failed), { id: failed.id });
    expect(fs.id).toBe(failed.id);
    expect(fs.filename).toBe(failed.filename);
    expect(fs.url).toBe(failed.url);
    expect(fs.updateInterval).toBe(failed.update_interval);
    expect(fs.lastUpdated).toBe(
      timeMonthDayYear(failed.latest_file_update_operation.started_at)
    );
    expect(fs.latestFileUpdateOperationStatus).toBe(
      failed.latest_file_update_operation.status
    );
    expect(fs.isCurrentlyRunning).toBe(false);
    expect(fs.hasBeenRun).toBe(true);
    expect(fs.failureReason).toBe(
      failed.latest_file_update_operation.failure_reason
    );
    expect(fs.showFailureReason).toBe(true);

    expect(fs.isDeletingClass).toBe("disappearing");
    expect(fs.isConfirmingDelete).toBe(true);
  });
});
