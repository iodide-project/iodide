import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { moveCursorToNextChunk, updateEditorCursor } from "../actions";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("updateEditorCursor - returns correct action", () => {
  it("should create an action to update the cursor (NO force param)", () => {
    const [editorCursorLine, editorCursorChar] = [1, 2];
    const expectedAction = {
      type: "UPDATE_CURSOR",
      editorCursorLine,
      editorCursorChar,
      editorCursorForceUpdate: false
    };
    expect(updateEditorCursor(editorCursorLine, editorCursorChar)).toEqual(
      expectedAction
    );
  });

  it("should create an action to update the cursor (with force param)", () => {
    const [editorCursorLine, editorCursorChar, editorCursorForceUpdate] = [
      1,
      2,
      true
    ];
    const expectedAction = {
      type: "UPDATE_CURSOR",
      editorCursorLine,
      editorCursorChar,
      editorCursorForceUpdate
    };
    expect(
      updateEditorCursor(
        editorCursorLine,
        editorCursorChar,
        editorCursorForceUpdate
      )
    ).toEqual(expectedAction);
  });
});

describe("moveCursorToNextChunk dispatches correct actions", () => {
  it("no selection, and one chunk", () => {
    const [editorCursorLine, editorCursorChar] = [1, 2];

    const store = mockStore({
      editorCursorLine,
      editorCursorChar,
      jsmdChunks: [{ startLine: 0, endLine: 10 }],
      editorSelections: []
    });

    const expectedActions = [
      {
        type: "UPDATE_CURSOR",
        editorCursorLine: 11,
        editorCursorChar: 0,
        editorCursorForceUpdate: true
      }
    ];

    store.dispatch(moveCursorToNextChunk());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("no selection, multiple chunks", () => {
    const [editorCursorLine, editorCursorChar] = [12, 25];

    const store = mockStore({
      editorCursorLine,
      editorCursorChar,
      jsmdChunks: [
        { startLine: 0, endLine: 10 },
        { startLine: 11, endLine: 15 },
        { startLine: 16, endLine: 20 }
      ],
      editorSelections: []
    });

    const expectedActions = [
      {
        type: "UPDATE_CURSOR",
        editorCursorLine: 16,
        editorCursorChar: 0,
        editorCursorForceUpdate: true
      }
    ];

    store.dispatch(moveCursorToNextChunk());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("one selection, and one chunk", () => {
    const [editorCursorLine, editorCursorChar] = [1, 2];

    const store = mockStore({
      editorCursorLine,
      editorCursorChar,
      jsmdChunks: [{ startLine: 0, endLine: 10 }],
      editorSelections: [
        { start: { line: 3, col: 2 }, end: { line: 5, col: 2 } }
      ]
    });

    const expectedActions = [
      {
        type: "UPDATE_CURSOR",
        editorCursorLine: 11,
        editorCursorChar: 0,
        editorCursorForceUpdate: true
      }
    ];

    store.dispatch(moveCursorToNextChunk());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("one selection across multiple chunks", () => {
    const [editorCursorLine, editorCursorChar] = [12, 25];

    const store = mockStore({
      editorCursorLine,
      editorCursorChar,
      jsmdChunks: [
        { startLine: 0, endLine: 10 },
        { startLine: 11, endLine: 15 },
        { startLine: 16, endLine: 20 },
        { startLine: 21, endLine: 100 }
      ],
      editorSelections: [
        { start: { line: 3, col: 2 }, end: { line: 17, col: 2 } }
      ]
    });

    const expectedActions = [
      {
        type: "UPDATE_CURSOR",
        editorCursorLine: 21,
        editorCursorChar: 0,
        editorCursorForceUpdate: true
      }
    ];

    store.dispatch(moveCursorToNextChunk());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("multiple selections in multiple chunks", () => {
    const [editorCursorLine, editorCursorChar] = [12, 25];

    const store = mockStore({
      editorCursorLine,
      editorCursorChar,
      jsmdChunks: [
        { startLine: 0, endLine: 10 },
        { startLine: 11, endLine: 15 },
        { startLine: 16, endLine: 20 },
        { startLine: 21, endLine: 100 }
      ],
      editorSelections: [
        { start: { line: 3, col: 2 }, end: { line: 7, col: 2 } },
        { start: { line: 13, col: 2 }, end: { line: 19, col: 2 } }
      ]
    });

    const expectedActions = [
      {
        type: "UPDATE_CURSOR",
        editorCursorLine: 21,
        editorCursorChar: 0,
        editorCursorForceUpdate: true
      }
    ];

    store.dispatch(moveCursorToNextChunk());
    expect(store.getActions()).toEqual(expectedActions);
  });
});
