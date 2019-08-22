export const historyItemSchema = {
  type: "object",
  properties: {
    // content: { type: "string" },
    content: {
      anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }]
    },
    historyId: { type: "string" },
    historyType: {
      type: "string",
      enum: [
        "APP_MESSAGE",
        "FETCH_CELL_INFO",
        "CONSOLE_INPUT",
        "CONSOLE_OUTPUT",
        "CONSOLE_MESSAGE"
      ]
    },
    level: { type: "string", enum: ["INFO", "LOG", "WARN", "ERROR"] },
    language: { type: "string" }
  },
  if: {
    properties: {
      historyType: {
        enum: ["FETCH_CELL_INFO"]
      }
    }
  },
  then: {
    properties: {
      content: {
        type: "array",
        items: { type: "string" },
        default: []
      }
    }
  },
  else: {
    properties: { content: { type: "string" } }
  },
  additionalProperties: false
};

export const historySchema = {
  type: "array",
  items: historyItemSchema,
  default: []
};
