import Ajv from "ajv";

import { languageSchema, historySchema } from "../state-schemas/state-schema";
// these are the schemas of actions from the eval frame that
// are ok to pass to the editor

export class ActionSchemaValidationError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "ActionSchemaValidationError";
  }
}

const languageActionSchema = Object.assign({}, languageSchema);
languageActionSchema.properties.type = { type: "string" };

const historyActionSchema = Object.assign({}, historySchema);
historyActionSchema.properties.type = { type: "string" };

const schemas = {
  ADD_LANGUAGE_TO_EVAL_FRAME: languageActionSchema,
  APPEND_TO_EVAL_HISTORY: historyActionSchema,
  ADD_TO_CONSOLE: historyActionSchema,
  CLEAR_CONSOLE_TEXT_CACHE: {
    type: "object",
    additionalProperties: false,
    properties: {
      type: { type: "string" }
    },
    required: ["type"]
  },
  CONSOLE_HISTORY_MOVE: {
    type: "object",
    additionalProperties: false,
    properties: {
      type: { type: "string" },
      consoleCursorDelta: { type: "integer" }
    },
    required: ["type", "consoleCursorDelta"]
  },
  // FIXME environment actions disabled for now
  // ENVIRONMENT_UPDATE_FROM_EDITOR: {
  // },
  // ENVIRONMENT_UPDATE_FROM_EVAL_FRAME: {
  // },
  RESET_HISTORY_CURSOR: {
    type: "object",
    additionalProperties: false,
    properties: {
      type: { type: "string" }
    },
    required: ["type"]
  },
  // FIXME environment actions disabled for now
  // SAVE_ENVIRONMENT: {
  // },
  UPDATE_CONSOLE_TEXT: {
    type: "object",
    additionalProperties: false,
    properties: {
      type: { type: "string" },
      consoleText: { type: "string" }
    },
    required: ["type", "consoleText"]
  },
  UPDATE_USER_VARIABLES: {
    type: "object",
    additionalProperties: false,
    properties: {
      type: { type: "string" },
      userDefinedVarNames: {
        type: "array",
        items: { type: "string" }
      }
    },
    required: ["type", "userDefinedVarNames"]
  },
  UPDATE_VALUE_IN_HISTORY: {
    type: "object",
    additionalProperties: false,
    properties: {
      type: { type: "string" },
      historyId: { type: "integer" }
    },
    required: ["type", "historyId"]
  }
};

const memoizedValidators = () => {
  const cachedValidators = {};
  return type => {
    if (type in cachedValidators) {
      return cachedValidators[type];
    }

    const ajv = new Ajv();
    const validator = ajv.compile(schemas[type]);
    cachedValidators[type] = validator;
    return cachedValidators[type];
  };
};

const validator = memoizedValidators();

export default function validateActionFromEvalFrame(action) {
  if (!action.type) {
    throw new ActionSchemaValidationError(
      "Invalid action from eval frame: No action type"
    );
  } else if (!Object.keys(schemas).includes(action.type)) {
    throw new ActionSchemaValidationError(
      "Invalid action from eval frame: action type not permitted"
    );
  } else if (!validator(action.type)(action)) {
    throw new ActionSchemaValidationError(`Invalid action from eval frame: bad schema.
schema error:
${JSON.stringify(validator(action.type).errors, null, " ")}
action causing error:
${JSON.stringify(action, null, " ")}`);
  }

  return true;
}
