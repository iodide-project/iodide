export const consoleInputSchema = {
  type: "object",
  properties: {
    consoleText: { type: "string" },
    // stores the current entry when keying up/down
    consoleTextCache: { type: "string" },
    // the position from the END of the history when keying up/down in the console
    consoleScrollbackPosition: { type: "integer" }
  },
  default: {
    consoleText: "",
    consoleTextCache: "",
    consoleScrollbackPosition: 0
  },
  additionalProperties: false
};
