export const historySchema = {
  type: "object",
  properties: {
    content: { type: "string" },
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
    lastRan: { type: "integer" },
    level: { type: "string", enum: ["INFO", "LOG", "WARN", "ERROR"] },
    language: { type: "string" },
    value: {}
  },
  additionalProperties: false
};
