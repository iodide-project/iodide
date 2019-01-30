import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { evaluateNotebook, nonRunnableChunkType } from "../actions";

const mockStore = configureMockStore([thunk]);

describe("evaluateNotebook - correct evaluations", () => {
  let evaluateNotebookTest;
  let mockEvalQueue;

  let store;
  let testState;

  beforeEach(() => {
    mockEvalQueue = { evaluate: jest.fn() };
    evaluateNotebookTest = evaluateNotebook(mockEvalQueue);

    store = undefined;
    testState = {
      jsmdChunks: [
        {
          chunkContent: "var pi=3",
          chunkType: "anyChunkType",
          chunkId: "chunkHashDefault",
          evalFlags: [],
          startLine: 5,
          endLine: 6
        }
      ],
      kernelState: "~~NOT~~ KERNEL_BUSY"
    };
  });

  it("calls evalQueueInstance.evaluate for general chunk types", async () => {
    store = mockStore(testState);
    await store.dispatch(evaluateNotebookTest());
    expect(mockEvalQueue.evaluate.mock.calls.length).toBe(1);
  });

  it("calls evalQueueInstance.evaluate correct number of times", async () => {
    testState.jsmdChunks = [
      {
        chunkContent: "var pi=3",
        chunkType: "anyChunkType",
        chunkId: "chunkHash-1",
        evalFlags: [],
        startLine: 5,
        endLine: 6
      },
      {
        chunkContent: "var pi=3",
        chunkType: "anyChunkType",
        chunkId: "chunkHash-2",
        evalFlags: [],
        startLine: 5,
        endLine: 6
      },
      {
        chunkContent: "var pi=3",
        chunkType: "md" /* should be skipped */,
        chunkId: "chunkHash-3",
        evalFlags: [],
        startLine: 5,
        endLine: 6
      }
    ];
    store = mockStore(testState);

    await store.dispatch(evaluateNotebookTest());

    expect(mockEvalQueue.evaluate.mock.calls.length).toBe(2);
  });

  nonRunnableChunkType.forEach(chunkType => {
    it(`doesn't call evalQueueInstance.evaluate for chunktype: ${chunkType}`, async () => {
      testState.jsmdChunks[0].chunkType = chunkType;
      store = mockStore(testState);
      await store.dispatch(evaluateNotebookTest());
      expect(mockEvalQueue.evaluate.mock.calls.length).toBe(0);
    });
  });

  ["skipRunAll", "skiprunall"].forEach(skipFlag => {
    it(`doesn't call evalQueueInstance.evaluate if chunk has ${skipFlag}`, async () => {
      testState.jsmdChunks[0].evalFlags = [skipFlag];
      store = mockStore(testState);
      await store.dispatch(evaluateNotebookTest());
      expect(mockEvalQueue.evaluate.mock.calls.length).toBe(0);
    });
  });
});

describe("evaluateNotebook - correct evaluations", () => {
  let evaluateNotebookTest;
  let mockEvalQueue;

  let store;
  let testState;

  beforeEach(() => {
    mockEvalQueue = { evaluate: jest.fn() };
    evaluateNotebookTest = evaluateNotebook(mockEvalQueue);

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

    store.dispatch(evaluateNotebookTest());
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: "SET_KERNEL_STATE",
      kernelState: "KERNEL_BUSY"
    });
  });

  it("doesn't set kernel state if kernel is busy", () => {
    testState.kernelState = "KERNEL_BUSY";
    store = mockStore(testState);

    store.dispatch(evaluateNotebookTest());
    const actions = store.getActions();

    expect(actions.map(a => a.type).includes("SET_KERNEL_STATE")).toBe(false);
  });
});
