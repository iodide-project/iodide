import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { addToEvalQueue, evaluateNotebook } from "../eval-actions";
import { NONCODE_EVAL_TYPES } from "../../state-schemas/state-schema";

const mockStore = configureMockStore([thunk]);

describe("evaluateNotebook", () => {
  let store;
  let testState;

  beforeEach(() => {
    store = undefined;
    testState = {
      jsmdChunks: [
        { id: 0, evalFlags: ["skipRunAll"] },
        { id: 1, evalFlags: [] },
        { id: 2, evalFlags: ["skipRunAll"] },
        { id: 3, evalFlags: [] }
      ]
    };
  });

  it("pass correct chunks", () => {
    const expectedActions = [
      { type: "ADD_TO_EVAL_QUEUE", chunk: testState.jsmdChunks[1] },
      { type: "ADD_TO_EVAL_QUEUE", chunk: testState.jsmdChunks[3] }
    ];

    store = mockStore(testState);
    store.dispatch(evaluateNotebook());
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe("addToEvalQueue", () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
  });

  // some random types that SHOULD be enqueued
  ["js", "py", "jl", "etc"].map(chunkType => {
    const chunk = { chunkType };
    it("dispatch if chunk of any type other than NONCODE_EVAL_TYPES", () => {
      addToEvalQueue(chunk)(dispatch);
      expect(dispatch).toBeCalledWith({ type: "ADD_TO_EVAL_QUEUE", chunk });
    });
  });

  NONCODE_EVAL_TYPES.map(chunkType => {
    const chunk = { chunkType };
    it("DO NOT dispatch if chunk of any NONCODE_EVAL_TYPES", () => {
      addToEvalQueue(chunk)(dispatch);
      expect(dispatch).not.toBeCalled();
    });
  });
});
