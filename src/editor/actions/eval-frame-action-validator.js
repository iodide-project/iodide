import Ajv from "ajv";

import { historyItemSchema } from "../console/history/state-schema";
import { languageSchema } from "../state-schemas/state-schema";
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

const historyActionSchema = Object.assign({}, historyItemSchema);
historyActionSchema.properties.type = { type: "string" };

const schemas = {
  ADD_LANGUAGE_TO_EVAL_FRAME: {
    type: "object",
    properties: {
      languageDefinition: languageActionSchema
    }
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
  "console/history/ADD": historyActionSchema,
  "console/history/UPDATE": {
    type: "object",
    additionalProperties: false,
    required: ["type", "historyItem"],
    properties: {
      type: {
        type: "string"
      },
      historyItem: {
        type: "object",
        properties: {
          historyId: { type: "string" },
          content: { type: "string" },
          level: {
            type: "string",
            enum: ["INFO", "LOG", "WARN", "ERROR"]
          },
          historyType: { type: "string" }
        },
        additionalProperties: false,
        required: ["historyId"]
      }
    }
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
    if (action.type.startsWith("@@redux/INIT")) {
      console.info("Redux initiated: ", action.type);
    } else {
      throw new ActionSchemaValidationError(
        `Invalid action from eval frame: action type not permitted: ${action.type}`
      );
    }
  } else if (!validator(action.type)(action)) {
    throw new ActionSchemaValidationError(`Invalid action from eval frame: bad schema.
schema error:
${JSON.stringify(validator(action.type).errors, null, " ")}
action causing error:
${JSON.stringify(action, null, " ")}`);
  }

  return true;
}
