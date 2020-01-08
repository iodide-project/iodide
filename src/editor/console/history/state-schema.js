export const genericHistoryItemSchema = {
  type: "object",
  properties: {
    content: { type: "string" },
    evalId: { type: "string" },
    historyId: { type: "string" },
    historyType: {
      type: "string",
      enum: ["APP_MESSAGE", "CONSOLE_OUTPUT", "CONSOLE_MESSAGE"]
    },
    level: { type: "string", enum: ["INFO", "LOG", "WARN", "ERROR"] },
    language: { type: "string" }
  },
  additionalProperties: false
};

export const inputItemSchema = {
  type: "object",
  properties: {
    content: { type: "string" },
    evalId: { type: "string" },
    historyId: { type: "string" },
    historyType: { const: "CONSOLE_INPUT" },
    language: { type: "string" },
    originalLines: {
      type: "object",
      properties: {
        startLine: { type: "integer" },
        endLine: { type: "integer" }
      },
      additionalProperties: false,
      default: {}
    },
    currentLines: {
      type: "object",
      properties: {
        startLine: { type: "integer" },
        endLine: { type: "integer" }
      },
      additionalProperties: false,
      default: {}
    },
    editedSinceEval: { type: "boolean", default: false }
  },
  additionalProperties: false
};

export const historyFetchInfoSchema = {
  type: "object",
  properties: {
    content: { type: "array", items: { type: "string" } },
    historyId: { type: "string" },
    historyType: { const: "CONSOLE_OUTPUT_FETCH" }
  },
  additionalProperties: false
};

export const errorStackItemSchema = {
  type: "object",
  properties: {
    evalId: { type: "string" },
    historyId: { type: "string" },
    historyType: { const: "CONSOLE_OUTPUT_ERROR_STACK" }
  },
  additionalProperties: false
};

export const historySchema = {
  type: "array",
  items: {
    anyOf: [
      genericHistoryItemSchema,
      historyFetchInfoSchema,
      inputItemSchema,
      errorStackItemSchema
    ]
  },
  default: []
};
