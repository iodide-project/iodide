const loadedScriptTracebackSchema = {
  type: "object",
  properties: {
    tracebackType: { const: "FETCHED_JS_SCRIPT" },
    tracebackId: { type: "string" },
    url: { type: "string" },
    filename: { type: "string" }
  },
  additionalProperties: true
};

const userEvalTracebackSchema = {
  type: "object",
  properties: {
    tracebackType: { const: "USER_EVALUATION" },
    evalId: { type: "string" },
    tracebackId: { type: "string" }
  },
  additionalProperties: true
};

const errorStackItemSchema = {
  type: "object",
  properties: {
    functionName: { type: "string" },
    tracebackId: { type: "string" },
    lineNumber: { type: "number" },
    columnNumber: { type: "number" },
    evalInUserCode: { type: "boolean" }
  },
  additionalProperties: false
};

const evalErrorStackSchema = {
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
};

export const tracebackInfoSchema = {
  type: "object",
  properties: {
    tracebackItems: {
      type: "object",
      additionalProperties: {
        anyOf: [loadedScriptTracebackSchema, userEvalTracebackSchema]
      },
      default: {}
    },
    evalErrorStacks: {
      type: "object",
      additionalProperties: evalErrorStackSchema,
      default: {}
    }
  },
  additionalProperties: false,
  default: { tracebackItems: {}, evalErrorStacks: {} }
};
