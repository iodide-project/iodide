const loadedScriptsSchema = {
  type: "object",
  properties: {
    tracebackId: { type: "string" },
    url: { type: "string" },
    filename: { type: "string" }
  },
  additionalProperties: true
};

const evalRangesSchema = {
  type: "object",
  properties: {
    historyId: { type: "string" },
    tracebackId: { type: "string" },
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
  additionalProperties: true
};

const evalErrorStackSchema = {
  type: "object",
  properties: {
    historyId: { type: "string" },
    tracebackId: { type: "string" },
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
  additionalProperties: true
};

export const tracebackInfoSchema = {
  type: "object",
  properties: {
    loadedScripts: {
      type: "object",
      additionalProperties: loadedScriptsSchema,
      default: {}
    },
    evalRanges: {
      type: "object",
      additionalProperties: evalRangesSchema,
      default: {}
    },
    evalErrorStacks: {
      type: "object",
      additionalProperties: evalErrorStackSchema,
      default: {}
    }
  },
  additionalProperties: false,
  default: { evalRanges: {}, loadedScripts: {} }
};
