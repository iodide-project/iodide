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

// /*  eslint-disable no-unused-vars */
// const window = {
//   /*  eslint-enable no-unused-vars */
//   getDoc: () => ({ somethingSelected: () => false })
// };
window.ACTIVE_CODEMIRROR = {
  getDoc: () => ({ somethingSelected: () => false })
};

describe("moveCursorToNextChunk dispatches correct actions", () => {
  it("no selection, and one chunk", () => {
    const [editorCursorLine, editorCursorChar] = [1, 2];

    const store = mockStore({
      editorCursorLine,
      editorCursorChar,
      jsmdChunks: [{ startLine: 0, endLine: 10 }]
    });

    const expectedActions = [
      {
        type: "UPDATE_CURSOR",
        editorCursorLine: 11,
        editorCursorChar: 0,
        editorCursorForceUpdate: true
      }
    ];

    // return store.dispatch(moveCursorToNextChunk()).then(() => {
    //   // return of async actions
    //   expect(store.getActions()).toEqual(expectedActions);
    // });
    store.dispatch(moveCursorToNextChunk());
    expect(store.getActions()).toEqual(expectedActions);
  });
});
