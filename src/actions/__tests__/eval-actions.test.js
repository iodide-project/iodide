import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { evaluateNotebook } from "../actions";
import evalQueue from "../evaluation-queue";

export const mockStore = configureMockStore([thunk]);

describe("evaluateNotebook - correct evaluations", () => {
  let store;
  let testState;
  beforeEach(() => {
    evalQueue.connectToRedux(null);
    store = undefined;
    testState = {
      jsmdChunks: [
        {
          chunkContent: "var pi=3",
          chunkType: "anyChunkType",
          chunkId: "chunkHash123",
          evalFlags: [],
          startLine: 5,
          endLine: 6
        }
      ],
      kernelState: "~~NOT~~ KERNEL_BUSY"
    };
  });

  it("does TRIGGER_TEXT_EVAL_IN_FRAME for chunk general chunk types", async () => {
    store = mockStore(testState);
    evalQueue.connectToRedux(store.dispatch);

    await store.dispatch(evaluateNotebook());
    const actions = store.getActions();

    expect(
      actions.map(a => a.type).includes("TRIGGER_TEXT_EVAL_IN_FRAME")
    ).toBe(true);
  });

  // FIXME: this test doesn't work b/c the singlton-ness
  // of the evalQueue causes some kind of problem.
  // might need to rethink how the eval queue is instantiated
  // or handed to the evaluateNotebook action creator, or who knows...
  // but after the first test, TRIGGER_TEXT_EVAL_IN_FRAME never seems
  // to be dispatched

  // it("does TRIGGER_TEXT_EVAL_IN_FRAME correct number of times", async () => {
  //   testState.jsmdChunks = [
  //     {
  //       chunkContent: "var pi=3",
  //       chunkType: "anyChunkType",
  //       chunkId: "chunkHash123",
  //       evalFlags: [],
  //       startLine: 5,
  //       endLine: 6
  //     },
  //     {
  //       chunkContent: "var pi=3",
  //       chunkType: "md", // SHOULD BE SKIPPED
  //       chunkId: "chunkHash123",
  //       evalFlags: [],
  //       startLine: 5,
  //       endLine: 6
  //     },
  //     {
  //       chunkContent: "var pi=3",
  //       chunkType: "anyChunkType",
  //       chunkId: "chunkHash123",
  //       evalFlags: [],
  //       startLine: 5,
  //       endLine: 6
  //     }
  //   ];
  //   store = mockStore(testState);
  //   evalQueue.connectToRedux(store.dispatch);

  //   await store.dispatch(evaluateNotebook());
  //   const actions = store.getActions();

  //   expect(
  //     actions.filter(a => a.type === "TRIGGER_TEXT_EVAL_IN_FRAME").length
  //   ).toBe(2);
  // });

  // it("doesn't TRIGGER_TEXT_EVAL_IN_FRAME if chunk has skipRunAll", async () => {
  //   testState.jsmdChunks.evalFlags = ["skipRunAll"];
  //   store = mockStore(testState);
  //   evalQueue.connectToRedux(store.dispatch);

  //   await store.dispatch(evaluateNotebook());
  //   const actions = store.getActions();

  //   expect(
  //     actions.map(a => a.type).includes("TRIGGER_TEXT_EVAL_IN_FRAME")
  //   ).toBe(false);
  // });
});

describe("evaluateNotebook - setKernelState", () => {
  let store;
  let testState;
  beforeEach(() => {
    evalQueue.connectToRedux(null);
    store = undefined;
    testState = {
      jsmdChunks: [
        {
          chunkContent: "var pi=3",
          chunkType: "anyChunkType",
          chunkId: "chunkHash123",
          evalFlags: [],
          startLine: 5,
          endLine: 6
        }
      ],
      kernelState: "~~NOT~~ KERNEL_BUSY"
    };
  });

  it("sets kernel state to busy if kernel is NOT busy", () => {
    store = mockStore(testState);
    evalQueue.connectToRedux(store.dispatch);

    store.dispatch(evaluateNotebook());
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: "SET_KERNEL_STATE",
      kernelState: "KERNEL_BUSY"
    });
  });

  it("doesn't set kernel state if kernel is busy", () => {
    testState.kernelState = "KERNEL_BUSY";
    store = mockStore(testState);
    evalQueue.connectToRedux(store.dispatch);

    store.dispatch(evaluateNotebook());
    const actions = store.getActions();

    expect(actions.map(a => a.type).includes("SET_KERNEL_STATE")).toBe(false);
  });
});
