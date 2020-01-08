export const genericHistoryItemSchema = {
  type: "object",
  properties: {
    content: { type: "string" },
    historyId: { type: "string" },
    historyType: {
      type: "string",
      enum: [
        "APP_MESSAGE",
        "CONSOLE_OUTPUT",
        "CONSOLE_MESSAGE",
        "CONSOLE_OUTPUT_ERROR_STACK"
      ]
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
    historyId: { type: "string" },
    historyType: { const: "CONSOLE_INPUT" },
    language: { type: "string" }
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

export const historySchema = {
  type: "array",
  items: {
    anyOf: [genericHistoryItemSchema, historyFetchInfoSchema, inputItemSchema]
  },
  default: []
};
