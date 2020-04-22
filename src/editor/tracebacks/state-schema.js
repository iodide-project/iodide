const errorStackItemSchema = {
  type: "object",
  properties: {
    functionName: { type: "string" },
    jsScriptTagBlobId: { type: "string" },
    evalId: { type: "string" },
    lineNumber: { type: "number" },
    columnNumber: { type: "number" },
    evalInUserCode: { type: "boolean" }
  },
  additionalProperties: false
};

export const evalErrorStacksSchema = {
  type: "object",

  additionalProperties: {
    type: "object",
    properties: {
      message: { type: "string" },
      name: { type: "string" },
      stack: {
        type: "array",
        items: errorStackItemSchema,
        default: []
      }
    },
    additionalProperties: false
  },
  default: { tracebackItems: {}, evalErrorStacks: {} }
};
