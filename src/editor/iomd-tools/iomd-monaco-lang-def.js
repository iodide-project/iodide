const validSyntaxes = ["py", "js", "css", "md", "fetch"];

// eslint-disable-next-line no-useless-escape
const invalidRegex = new RegExp(`(?!(${validSyntaxes.join("|")}))(\w*)`);
console.log({ invalidRegex });
export const language = {
  ignoreCase: true,

  tokenizer: {
    root: [[/^%%\s*/, "comment", "@jsmdDelimLine"]],

    jsmdDelimLine: [
      [/py/, { token: "attribute.name", next: "@embed", nextEmbedded: "py" }],
      [/js/, { token: "attribute.name", next: "@embed", nextEmbedded: "js" }],
      [/css/, { token: "attribute.name", next: "@embed", nextEmbedded: "css" }],
      [/md/, { token: "attribute.name", next: "@embed", nextEmbedded: "md" }],
      [/fetch/, { token: "attribute.name", next: "@fetchDelimLine" }],
      [/raw/, { token: "attribute.name", next: "@rawDelimLine" }],
      // [invalidRegex, { token: "attribute.name", next: "@rawDelimLine" }],
      [/^%%/, { token: "@rematch", next: "@pop" }]
    ],

    fetchDelimLine: [
      // [/[\w]+/, 'attribute.value'],
      // [/[ \t\r\n]+/], // whitespace
      // [/a[\w]* [\w]*/,{token: "constant",next: "@embed",nextEmbedded: "md"}],
      [/["":{}} \w]*$/, { token: "type", next: "@embed", nextEmbedded: "md" }],
      [/^%%/, { token: "@rematch", next: "@pop" }]
    ],

    rawDelimLine: [[/^%%/, { token: "@rematch", next: "@pop" }]],

    embed: [[/^%%/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }]]
  }
};
