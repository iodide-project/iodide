import { store } from "../../store";
import { toggleModal } from "../modal-actions";
import {
  clearVariables,
  resetNotebook,
  saveNotebook,
  setViewMode,
  updateTitle
} from "../notebook-actions";
import { evaluateNotebook, setKernelState } from "../eval-actions";

import { stateProperties } from "../../state-schemas/state-schema";
import { SchemaValidationError } from "../../reducers/create-validated-reducer";
import { languageDefinitions } from "../../state-schemas/language-definitions";

// the integration tests in this file DO NOT verify the correctness
// of the action creators; rather, they ensure that when the action
// creators are dispatched, the store ends up in a valid state
// according to the state schema.
// This relies on the functionality in createValidatedReducer

describe("make sure createValidatedReducer is checking correctly", () => {
  it("createValidatedReducer should throw an error if we pass an action that inserts an invalid state value", () => {
    expect(() => store.dispatch(toggleModal(100))).toThrowError(
      SchemaValidationError
    );
  });
});

describe("make sure action creators leave store in a consitent state", () => {
  beforeEach(() => {
    store.dispatch(resetNotebook());
  });

  it("setKernelState", () => {
    expect(() => store.dispatch(setKernelState("KERNEL_BUSY"))).not.toThrow();
  });

  it("saveNotebook", () => {
    expect(() => store.dispatch(saveNotebook())).not.toThrow();
  });
  it("saveNotebook(false)", () => {
    expect(() => store.dispatch(saveNotebook(false))).not.toThrow();
  });

  it("clearVariables", () => {
    expect(() => store.dispatch(clearVariables())).not.toThrow();
  });

  it("updateTitle", () => {
    expect(() => store.dispatch(updateTitle("test title"))).not.toThrow();
  });

  it("setViewMode", () => {
    expect(() => store.dispatch(setViewMode("REPORT_VIEW"))).not.toThrow();
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
