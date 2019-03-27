import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import {
  addToEvalQueue,
  evaluateNotebook,
  evalConsoleInput,
  evaluateText
} from "../eval-actions";
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

// ========================================================

describe("addToEvalQueue", () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
  });

  // some random types that SHOULD be enqueued
  ["js", "py", "jl", "etc"].forEach(chunkType => {
    const chunk = { chunkType };
    it("dispatch if chunk of any type other than NONCODE_EVAL_TYPES", () => {
      addToEvalQueue(chunk)(dispatch);
      expect(dispatch).toBeCalledWith({ type: "ADD_TO_EVAL_QUEUE", chunk });
    });
  });

  NONCODE_EVAL_TYPES.forEach(chunkType => {
    const chunk = { chunkType };
    it("DO NOT dispatch if chunk of any NONCODE_EVAL_TYPES", () => {
      addToEvalQueue(chunk)(dispatch);
      expect(dispatch).not.toBeCalled();
    });
  });
});

// ========================================================

describe("evalConsoleInput", () => {
  let store;
  let testState;
  let consoleText;
  const languageLastUsed = "js";

  beforeEach(() => {
    store = undefined;
    testState = { languageLastUsed };
  });

  it("if there is text in the console, eval", () => {
    consoleText = "some code";
    const chunk = {
      chunkContent: consoleText,
      chunkType: languageLastUsed
    };

    const expectedActions = [
      { type: "CLEAR_CONSOLE_TEXT_CACHE" },
      { type: "RESET_HISTORY_CURSOR" },
      { type: "ADD_TO_EVAL_QUEUE", chunk },
      { type: "UPDATE_CONSOLE_TEXT", consoleText: "" }
    ];
    store = mockStore(testState);
    store.dispatch(evalConsoleInput(consoleText));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("if there is no text in the console, do nothing", () => {
    consoleText = "";

    const expectedActions = [];
    store = mockStore(testState);
    store.dispatch(evalConsoleInput(consoleText));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

// ========================================================

describe("evaluateText", () => {
  let store;
  let testState;
  // let editorSelections;
  // let editorCursor;

  beforeEach(() => {
    store = undefined;
    testState = {
      jsmdChunks: [0, 1, 2, 3, 4].map(i => {
        return {
          startLine: 10 * i,
          endLine: 10 * (i + 1) - 1,
          chunkContent: `code ${i}`,
          chunkType: `codeType-${i}`
        };
      }),
      editorSelections: [],
      editorCursor: { line: 0, col: 0 }
    };
  });

  [0, 1, 2, 3, 4].forEach(i => {
    it(`if no selection, adds the right chunk to the queue (case ${i})`, () => {
      testState.editorCursor.line = i * 10 + 5;
      store = mockStore(testState);

      store.dispatch(evaluateText());

      const expectedActions = [
        { type: "ADD_TO_EVAL_QUEUE", chunk: testState.jsmdChunks[i] }
      ];
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  // FIXME: this is a pain to test, so i'm punting on it.
  // it would require an elaborate state set up or mocking
  // a bunch of inner functions
  it("if there's a selection, adds the right chunks to the queue", () => {
    // testState.editorSelections = [
    //   { start: { line: 3, col: 6 }, end: { line: 5, col: 6 }, selectedText: "sel-text-1"}
    // ]
    // store = mockStore(testState);
    // store.dispatch(evaluateText(consoleText));
    // const expectedActions = [
    //   { type: "ADD_TO_EVAL_QUEUE", chunktestState.jsmdChunks[i] },
    // ];
    // expect(store.getActions()).toEqual(expectedActions);
  });
});
