export const historyItemSchemaBase = {
  type: "object",
  properties: {},
  additionalProperties: false
};

export const historyItemSharedProperties = {
  historyId: { type: "string" },
  scrollToThisItem: { type: "boolean" }
};

export const genericHistoryItemProperties = {
  content: { type: "string" },
  evalId: { type: "string" },
  historyType: {
    type: "string",
    enum: ["APP_MESSAGE", "CONSOLE_OUTPUT", "CONSOLE_MESSAGE"]
  },
  level: { type: "string", enum: ["INFO", "LOG", "WARN", "ERROR"] },
  language: { type: "string" },
  scrollToThisItem: { type: "boolean" }
};

export const inputItemProperties = {
  content: { type: "string" },
  evalId: { type: "string" },
  scrollToThisItem: { type: "boolean" },
  historyType: { const: "CONSOLE_INPUT" },
  language: { type: "string" },
  originalChunkId: { type: "string" },
  originalLines: {
    type: "object",
    properties: {
      startLine: { type: "integer" },
      endLine: { type: "integer" }
    },
    additionalProperties: false,
    default: {}
  },
  editedSinceEval: { type: "boolean", default: false }
};

export const historyFetchInfoProperties = {
  content: { type: "array", items: { type: "string" } },
  historyType: { const: "CONSOLE_OUTPUT_FETCH" }
};

export const errorStackItemProperties = {
  evalId: { type: "string" },
  historyType: { const: "CONSOLE_OUTPUT_ERROR_STACK" }
};

export const genericHistoryItemSchema = {
  ...historyItemSchemaBase,
  properties: {
    ...historyItemSharedProperties,
    ...genericHistoryItemProperties
  }
};
export const historyFetchInfoSchema = {
  ...historyItemSchemaBase,
  properties: { ...historyItemSharedProperties, ...historyFetchInfoProperties }
};
export const inputItemSchema = {
  ...historyItemSchemaBase,
  properties: { ...historyItemSharedProperties, ...inputItemProperties }
};
export const errorStackItemSchema = {
  ...historyItemSchemaBase,
  properties: { ...historyItemSharedProperties, ...errorStackItemProperties }
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

// const export const historyItemSchemaBase = {
//   type: "object",
//   properties: {
//     content: { type: "string" },
//     evalId: { type: "string" },
//     historyId: { type: "string" },
//     historyType: {
//       type: "string",
//       enum: ["APP_MESSAGE", "CONSOLE_OUTPUT", "CONSOLE_MESSAGE"]
//     },
//     level: { type: "string", enum: ["INFO", "LOG", "WARN", "ERROR"] },
//     language: { type: "string" },
//     scrollToThisItem: { type: "boolean" }
//   },
//   additionalProperties: false
// };

// export const genericHistoryItemSchema = {
//   type: "object",
//   properties: {
//     content: { type: "string" },
//     evalId: { type: "string" },
//     historyId: { type: "string" },
//     historyType: {
//       type: "string",
//       enum: ["APP_MESSAGE", "CONSOLE_OUTPUT", "CONSOLE_MESSAGE"]
//     },
//     level: { type: "string", enum: ["INFO", "LOG", "WARN", "ERROR"] },
//     language: { type: "string" },
//     scrollToThisItem: { type: "boolean" }
//   },
//   additionalProperties: false
// };

// export const inputItemSchema = {
//   type: "object",
//   properties: {
//     content: { type: "string" },
//     evalId: { type: "string" },
//     scrollToThisItem: { type: "boolean" },
//     historyId: { type: "string" },
//     historyType: { const: "CONSOLE_INPUT" },
//     language: { type: "string" },
//     originalChunkId: { type: "string" },
//     originalLines: {
//       type: "object",
//       properties: {
//         startLine: { type: "integer" },
//         endLine: { type: "integer" }
//       },
//       additionalProperties: false,
//       default: {}
//     },
//     currentLines: {
//       type: "object",
//       properties: {
//         startLine: { type: "integer" },
//         endLine: { type: "integer" }
//       },
//       additionalProperties: false,
//       default: {}
//     },
//     editedSinceEval: { type: "boolean", default: false }
//   },
//   additionalProperties: false
// };

// export const historyFetchInfoSchema = {
//   type: "object",
//   properties: {
//     content: { type: "array", items: { type: "string" } },
//     historyId: { type: "string" },
//     historyType: { const: "CONSOLE_OUTPUT_FETCH" }
//   },
//   additionalProperties: false
// };

// export const errorStackItemSchema = {
//   type: "object",
//   properties: {
//     evalId: { type: "string" },
//     historyId: { type: "string" },
//     historyType: { const: "CONSOLE_OUTPUT_ERROR_STACK" }
//   },
//   additionalProperties: false
// };

// export const historySchema = {
//   type: "array",
//   items: {
//     anyOf: [
//       genericHistoryItemSchema,
//       historyFetchInfoSchema,
//       inputItemSchema,
//       errorStackItemSchema
//     ]
//   },
//   default: []
// };
