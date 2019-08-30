import validateActionFromEvalFrame, {
  ActionSchemaValidationError
} from "../eval-frame-action-validator";

describe("validateActionFromEvalFrame should throw errors as expected", () => {
  it("throw if action obj has no type property", () => {
    expect(() => validateActionFromEvalFrame({ notType: 1 })).toThrowError(
      ActionSchemaValidationError
    );
  });

  it("throw if action obj has no type property not permitted", () => {
    expect(() =>
      validateActionFromEvalFrame({ type: "invalid_type" })
    ).toThrowError(ActionSchemaValidationError);
  });

  it("throw if action obj is not valid (extra action props)", () => {
    expect(() =>
      validateActionFromEvalFrame({
        type: "RESET_HISTORY_CURSOR",
        extra_prop: "extra_prop is not valid"
      })
    ).toThrowError(ActionSchemaValidationError);
  });

  it("throw if action obj is not valid (wrong prop types)", () => {
    expect(() =>
      validateActionFromEvalFrame({
        type: "UPDATE_VALUE_IN_HISTORY",
        historyItem: 10
      })
    ).toThrowError(ActionSchemaValidationError);
  });

  it("throw if action obj is not valid (missing prop)", () => {
    expect(() =>
      validateActionFromEvalFrame({
        type: "UPDATE_VALUE_IN_HISTORY"
      })
    ).toThrowError(ActionSchemaValidationError);
  });
});

describe("validateActionFromEvalFrame should return true it action is valid", () => {
  it("no action params", () => {
    expect(
      validateActionFromEvalFrame({
        type: "RESET_HISTORY_CURSOR"
      })
    ).toEqual(true);
  });

  it("some action params", () => {
    expect(
      validateActionFromEvalFrame({
        type: "UPDATE_VALUE_IN_HISTORY",
        historyItem: {
          historyId: "s03nv9dns",
          content: "ok",
          level: "ERROR"
        }
      })
    ).toEqual(true);
    expect(
      validateActionFromEvalFrame({
        type: "ADD_TO_CONSOLE_HISTORY",
        historyId: "s03nv9dns",
        content: "ok",
        historyType: "CONSOLE_MESSAGE",
        level: "ERROR"
      })
    ).toEqual(true);
  });
});
