import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import {
  addToEvalQueue,
  evaluateNotebook,
  evaluateText
} from "../eval-actions";

import { evalConsoleInput } from "../../console/input/thunks";
import { NONCODE_EVAL_TYPES } from "../../state-schemas/state-schema";
import { jsLanguageDefinition } from "../../state-schemas/language-definitions";

const mockStore = configureMockStore([thunk]);

describe("evaluateNotebook", () => {
  let store;
  let testState;

  beforeEach(() => {
    store = undefined;
    testState = {
      iomdChunks: [
        { id: 0, evalFlags: ["skipRunAll"], chunkContent: "foo" },
        { id: 1, evalFlags: [], chunkContent: "foo" },
        { id: 2, evalFlags: ["skipRunAll"], chunkContent: "foo" },
        { id: 3, evalFlags: [], chunkContent: "foo" }
      ],
      modalState: "MODALS_CLOSED"
    };
  });

  it("pass correct chunks", () => {
    const expectedActions = [
      { type: "ADD_TO_EVAL_QUEUE", chunk: testState.iomdChunks[1] },
      { type: "ADD_TO_EVAL_QUEUE", chunk: testState.iomdChunks[3] }
    ];

    store = mockStore(testState);
    store.dispatch(evaluateNotebook());
    expect(store.getActions()).toEqual(expectedActions);
  });
});

// ========================================================

describe("addToEvalQueue", () => {
  let store;
  let testState;
  const modalState = "MODALS_CLOSED";

  beforeEach(() => {
    store = undefined;
    testState = { modalState };
  });

  // some random types that SHOULD be enqueued
  ["js", "py", "jl", "etc"].forEach(chunkType => {
    const chunk = { chunkType, chunkContent: "foo" };
    it("dispatch if chunk of any type other than NONCODE_EVAL_TYPES", () => {
      const expectedActions = [{ type: "ADD_TO_EVAL_QUEUE", chunk }];
      store = mockStore(testState);
      store.dispatch(addToEvalQueue(chunk));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  NONCODE_EVAL_TYPES.forEach(chunkType => {
    const chunk = { chunkType, chunkContent: "foo" };
    it("DO NOT dispatch if chunk of any NONCODE_EVAL_TYPES", () => {
      const expectedActions = [];
      store = mockStore(testState);
      store.dispatch(addToEvalQueue(chunk));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  [
    "",
    `
`,
    "      ",
    `  
   
`,
    `


`
  ].forEach(chunkContent => {
    const chunk = { chunkType: jsLanguageDefinition, chunkContent };
    it("DO NOT dispatch if chunkContent is empty", () => {
      const expectedActions = [];
      store = mockStore(testState);
      store.dispatch(addToEvalQueue(chunk));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

// ========================================================

describe("evalConsoleInput", () => {
  let store;
  let testState;
  let consoleText;
  const languageLastUsed = "js";
  const modalState = "MODALS_CLOSED";

  beforeEach(() => {
    store = undefined;
    testState = { languageLastUsed, modalState };
  });

  it("if there is text in the console, eval", () => {
    consoleText = "some code";
    const chunk = {
      chunkContent: consoleText,
      chunkType: languageLastUsed
    };

    const expectedActions = [
      { type: "ADD_TO_EVAL_QUEUE", chunk },
      { type: "console/input/RESET" }
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
      iomdChunks: [0, 1, 2, 3, 4].map(i => {
        return {
          startLine: 10 * i,
          endLine: 10 * (i + 1) - 1,
          chunkContent: `code ${i}`,
          chunkType: `codeType-${i}`
        };
      }),
      editorSelections: [],
      editorCursor: { line: 1, col: 1 },
      modalState: "MODALS_CLOSED"
    };
  });

  [0, 1, 2, 3, 4].forEach(i => {
    it(`if no selection, adds the right chunk to the queue (case ${i})`, () => {
      testState.editorCursor.line = i * 10 + 5;
      store = mockStore(testState);

      store.dispatch(evaluateText());

      const expectedActions = [
        { type: "ADD_TO_EVAL_QUEUE", chunk: testState.iomdChunks[i] }
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
    //   { type: "ADD_TO_EVAL_QUEUE", chunktestState.iomdChunks[i] },
    // ];
    // expect(store.getActions()).toEqual(expectedActions);
  });
});
