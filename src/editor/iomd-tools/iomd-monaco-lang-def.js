// import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

// const validSyntaxes = ["py", "js", "css", "md", "fetch"];

// eslint-disable-next-line no-useless-escape
// const invalidRegex = new RegExp(`(?!(${validSyntaxes.join("|")}))(\w*)`);
// console.log({ invalidRegex });

// export const languageLong = {
//   // export const language = {
//   ignoreCase: true,

//   tokenizer: {
//     root: [
//       // [/^%% */, "comment", "@iomdDelimLine"],
//       // [/^%% *js/, { token: "attribute.name", next: "@jsDelimLine" }],
//       [
//         new RegExp(`^%% *js`),
//         { token: "attribute.name", next: "@jsDelimLine" }
//       ],
//       [
//         new RegExp(`^%% *fetch`),
//         { token: "attribute.name", next: "@fetchDelimLine" }
//       ],
//       [
//         new RegExp(`^%% *py`),
//         { token: "attribute.name", next: "@pyDelimLine" }
//       ],
//       [
//         new RegExp(`^%% *md`),
//         { token: "attribute.name", next: "@mdDelimLine" }
//       ],
//       [
//         new RegExp(`^%% *css`),
//         { token: "attribute.name", next: "@cssDelimLine" }
//       ],
//       [
//         new RegExp(`^%% *raw`),
//         { token: "attribute.name", next: "@rawDelimLine" }
//       ]
//     ],

//     jsDelimLine: [
//       [/["":{}} \w]*$/, { token: "type", next: "@embed", nextEmbedded: "js" }],
//       [/^%%/, { token: "@rematch", next: "@pop" }]
//     ],
//     fetchDelimLine: [
//       [
//         /["":{}} \w]*$/,
//         { token: "type", next: "@embed", nextEmbedded: "fetch" }
//       ],
//       [/^%%/, { token: "@rematch", next: "@pop" }]
//     ],
//     pyDelimLine: [
//       [/["":{}} \w]*$/, { token: "type", next: "@embed", nextEmbedded: "py" }],
//       [/^%%/, { token: "@rematch", next: "@pop" }]
//     ],
//     mdDelimLine: [
//       [/["":{}} \w]*$/, { token: "type", next: "@embed", nextEmbedded: "md" }],
//       [/^%%/, { token: "@rematch", next: "@pop" }]
//     ],
//     cssDelimLine: [
//       [/["":{}} \w]*$/, { token: "type", next: "@embed", nextEmbedded: "css" }],
//       [/^%%/, { token: "@rematch", next: "@pop" }]
//     ],
//     rawDelimLine: [
//       [/["":{}} \w]*$/, { token: "type", next: "@embed", nextEmbedded: "raw" }],
//       [/^%%/, { token: "@rematch", next: "@pop" }]
//     ],

//     embed: [[/^%%/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }]]
//   }
// };

export function makeLanguage(embedModes) {
  const language = {
    ignoreCase: true,
    tokenizer: {
      root: [],
      embed: [
        // [/^%%/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }]
        //   matches a delimLine that is all whatspace to EOL
        // e.g. has no explicit type or flags.
        [
          /^%% *$/,
          {
            token: "iomd-type",
            log:
              "delimline NO TYPE matched [$0, $1, $2] in state [$S0, $S1, $S2]"
          }
        ],
        // matches a delimLine with that is not all whitespace to EOL
        // e.g., that has type or flags.
        // In this case, pop and rematch
        [
          /^%% *[^ ].*$/,
          {
            token: "@rematch",
            log:
              "delimline with type matched [$0, $1, $2] in state [$S0, $S1, $S2]",
            next: "@pop",
            nextEmbedded: "@pop"
          }
        ]
      ]
    }
  };

  Object.entries(embedModes).forEach(([modeName, modeOpts]) => {
    JSON.stringify(modeOpts);
    // add a matcher to `root` that will look for a modename and
    //
    language.tokenizer.root.push([
      new RegExp(`^%% *${modeName}`),
      { token: "@rematch" /* "iomd-type" */, next: `@${modeName}DelimLine` }
    ]);

    language.tokenizer[`${modeName}DelimLine`] = [
      // match lines with modename but no flags (whitespace to EOL)
      [
        new RegExp(`^%% *${modeName} *$`),
        { token: "iomd-type", next: "@embed", nextEmbedded: modeName }
      ],
      // match lines with modename not whitespace to the end of the line
      [new RegExp(`^%% *${modeName} *`), { token: "iomd-type" }],
      // matches a delimLine that is all whatspace to EOL
      // e.g. has no explicit type or flags.
      [/^%% *$/, { token: "iomd-type" }],
      // matches a delimLine with that is not all whitespace to EOL
      // e.g., that has type or flags.
      // In this case, pop and rematch
      [/^%% *[^ ].*$/, { token: "@rematch", next: "@pop" }],
      // matches all tokens to the end of the line
      [
        /["":{}} \w]*$/,
        {
          token: "iomd-flag",
          next: "@embed",
          log: "EOL matched [$0, $1, $2] in state [$S0, $S1, $S2]",
          nextEmbedded: modeName
        }
      ]
    ];
  });
  return language;
}

const embedModes = { js: {}, md: {}, py: {}, css: {}, fetch: {} };

export const language = makeLanguage(embedModes);

// console.log("lang diff", difference(languageLong, language));

// console.log("languageLong", languageLong);
console.log("language", language);

export const conf = {
  // eslint-disable-next-line
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,
  comments: {
    blockComment: ["<!--", "-->"]
  },
  brackets: [["<!--", "-->"], ["<", ">"], ["{", "}"], ["(", ")"]],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],

  surroundingPairs: [
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "`", close: "`" }
  ]
  // onEnterRules: [
  //   {
  //     beforeText: new RegExp(
  //       // eslint-disable-next-line
  //       "<(?!(?:" +
  //         "))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$",
  //       "i"
  //     ),
  //     afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>$/i,
  //     action: { indentAction: monaco.languages.IndentAction.IndentOutdent }
  //   },
  //   {
  //     beforeText: new RegExp(
  //       "<(?!(?:" +
  //         "))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$",
  //       "i"
  //     ),
  //     action: { indentAction: monaco.languages.IndentAction.Indent }
  //   }
  // ],
  // folding: {
  //   markers: {
  //     start: new RegExp("^\\s*<!--\\s*#region\\b.*-->"),
  //     end: new RegExp("^\\s*<!--\\s*#endregion\\b.*-->")
  //   }
  // }
};
