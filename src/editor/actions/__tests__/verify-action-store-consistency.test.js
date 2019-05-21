import { store } from "../../store";
import * as actions from "../actions";
import { evaluateNotebook, setKernelState } from "../eval-actions";

import { stateProperties } from "../../state-schemas/state-schema";
import { SchemaValidationError } from "../../reducers/create-validated-reducer";
import { languageDefinitions } from "../../state-schemas/language-definitions";

// the integration tests in this file DO NOT verify the correctness
// of the action creators; rather, they ensure that when the action
// creators are dispatched, the store ends up in a valid state
// according to the state schema.
// This relies on the functionality in createValidatedReducer

const mockUserData = {
  name: "name",
  avatar: "avatar"
};

describe("make sure createValidatedReducer is checking correctly", () => {
  beforeEach(() => {
    store.dispatch(actions.resetNotebook());
  });
  it("createValidatedReducer should throw an error if we pass an action that inserts an invalid state value", () => {
    expect(() => store.dispatch(actions.setModalState(100))).toThrowError(
      SchemaValidationError
    );
  });
});

describe("make sure action creators leave store in a consitent state", () => {
  beforeEach(() => {
    store.dispatch(actions.resetNotebook());
  });

  it("setKernelState", () => {
    expect(() => store.dispatch(setKernelState("KERNEL_BUSY"))).not.toThrow();
  });

  it("updateAppMessages, no details", () => {
    expect(() =>
      store.dispatch(actions.updateAppMessages({ message: "foo" }))
    ).not.toThrow();
  });
  it("updateAppMessages, with details", () => {
    expect(() =>
      store.dispatch(
        actions.updateAppMessages({ message: "foo", details: "bat" })
      )
    ).not.toThrow();
  });

  it("toggleWrapInEditors", () => {
    expect(() => store.dispatch(actions.toggleWrapInEditors())).not.toThrow();
  });

  // FIXME: side effects in the reducer make these hard to test
  // it('exportNotebook', () => {
  //   expect(() => store.dispatch(actions.exportNotebook()))
  //     .not.toThrow()
  // })
  // it('exportNotebook, true', () => {
  //   expect(() => store.dispatch(actions.exportNotebook(true)))
  //     .not.toThrow()
  // })

  it("saveNotebook", () => {
    expect(() => store.dispatch(actions.saveNotebook())).not.toThrow();
  });
  it("saveNotebook(false)", () => {
    expect(() => store.dispatch(actions.saveNotebook(false))).not.toThrow();
  });

  it("clearVariables", () => {
    expect(() => store.dispatch(actions.clearVariables())).not.toThrow();
  });

  it("updateTitle", () => {
    expect(() =>
      store.dispatch(actions.updateTitle("test title"))
    ).not.toThrow();
  });

  it("setViewMode", () => {
    expect(() =>
      store.dispatch(actions.setViewMode("REPORT_VIEW"))
    ).not.toThrow();
  });

  it("addLanguage", () => {
    expect(() =>
      store.dispatch({
        type: "ADD_LANGUAGE_TO_EDITOR",
        languageDefinition: languageDefinitions.js
      })
    ).not.toThrow();
  });

  it("evaluateNotebook", () => {
    expect(() => store.dispatch(evaluateNotebook())).not.toThrow();
  });

  it("loginSuccess", () => {
    expect(() =>
      store.dispatch(actions.loginSuccess(mockUserData))
    ).not.toThrow();
  });
  it("loginFailure", () => {
    expect(() => store.dispatch(actions.loginFailure())).not.toThrow();
  });

  it("toggleHelpModal", () => {
    expect(() => store.dispatch(actions.clearVariables())).not.toThrow();
  });

  it("toggleEditorLink", () => {
    expect(() => store.dispatch(actions.clearVariables())).not.toThrow();
  });

  it("saveEnvironment", () => {
    expect(() =>
      store.dispatch(actions.saveEnvironment({ a: ["string", "foo"] }, true))
    ).not.toThrow();
  });

  it("saveEnvironment", () => {
    expect(() =>
      store.dispatch(actions.saveEnvironment({ a: ["string", "foo"] }, false))
    ).not.toThrow();
  });
});

describe("setKernelState", () => {
  it("createValidatedReducer should throw an error if we pass an invalid arg into setKernelState", () => {
    expect(() => store.dispatch(setKernelState("fake state"))).toThrowError(
      SchemaValidationError
    );
    expect(() => store.dispatch(setKernelState(12342323))).toThrowError(
      SchemaValidationError
    );
  });
  it("passes on correct set of enums for setKernelState", () => {
    const enums = stateProperties.kernelState.enum;
    enums.forEach(kernelState => {
      expect(() => store.dispatch(setKernelState(kernelState))).not.toThrow();
    });
  });
});
