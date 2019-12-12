const loadedScriptsSchema = {
  type: "object",
  properties: {
    evalFrameUUID: { type: "string" },
    url: { type: "string" },
    filename: { type: "string" }
  },
  additionalProperties: true
};

const evalRangesSchema = {};

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
    }
  },
  additionalProperties: false,
  default: { evalRanges: {}, loadedScripts: {} }
};
