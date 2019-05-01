import CodeMirror from "codemirror";
import "codemirror/addon/mode/simple";

CodeMirror.defineSimpleMode("fetch", {
  start: [
    { regex: /\/\/.*/, token: "comment", sol: true },
    { regex: /[\s]+\/\/.*/, token: "comment" },
    {
      regex: /(blob: |text: |json: |arrayBuffer: )(\w+)(\s*=\s*)(\S+)/,
      token: ["fetch-type", "fetch-variable-declaration", null, "fetch-path"]
    },
    { regex: /(js: |css: )(\S+)/, token: ["fetch-type", "fetch-path"] },
    {
      regex: /text: |blob: |json: |js: |css: |arrayBuffer: /,
      token: "fetch-type"
    }
  ],
  meta: {
    lineComment: "//"
  }
});
