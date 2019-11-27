import {
  IODIDE_API_LOAD_TYPES,
  FETCH_CHUNK_TYPES
} from "../../state-schemas/state-schema";

export const language = {
  tokenizer: {
    root: [
      [
        `^ *(${IODIDE_API_LOAD_TYPES.join(
          "|"
        )})(: *)([a-zA-Z_$][a-zA-Z0-9_$]*)( *= *)([^ ]+)( +//.*$)`,
        [
          "keyword",
          "delimiter",
          "identifier",
          "delimiter",
          "string.fetch-url",
          "comment"
        ]
      ],
      [
        `^ *(${IODIDE_API_LOAD_TYPES.join(
          "|"
        )})(: *)([a-zA-Z_$][a-zA-Z0-9_$]*)( *= *)(.+$)`,
        ["keyword", "delimiter", "identifier", "delimiter", "string.fetch-url"]
      ],
      [
        `^ *(${FETCH_CHUNK_TYPES.join("|")})(: *)([^ ]+)( +//.*$)`,
        ["keyword", "delimiter", "string.fetch-url", "comment"]
      ],
      [
        `^ *(${FETCH_CHUNK_TYPES.join("|")})(: *)(.*$)`,
        ["keyword", "delimiter", "string.fetch-url"]
      ],
      [" *//.*$", "comment"]
    ]
  }
};

export const conf = {
  comments: {
    lineComment: "//"
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"', notIn: ["string"] },
    { open: "'", close: "'", notIn: ["string", "comment"] }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ]
};
