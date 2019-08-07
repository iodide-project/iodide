export function compileIomdLanguageDef(embedModes) {
  const delimEOL = (token, nextEmbedded) => ({
    cases: {
      [`${nextEmbedded}@embedModes`]: {
        token,
        nextEmbedded,
        next: `@embed.${nextEmbedded}`,
        log: `delimLine @embedMode-- [$0, $1, $2] in state [$S0, $S1, $S2] \n next: @embed.$2`
      },
      "@default": {
        token,
        next: "@popall",
        log: `delimLine default-- [$0, $1, $2] in state [$S0, $S1, $S2]`
      }
    }
  });
  const language = {
    ignoreCase: true,
    embedModes: Object.keys(embedModes),
    tokenizer: {
      root: [
        [
          /^%%.*$/,
          {
            token: "@rematch" /* "iomd-type" */,
            next: `@delimLine`,
            log: `(root) @DelimLine -- [$0, $1, $2] in state [$S0, $S1, $S2]`
          }
        ]
      ],
      delimLine: [
        // first, check whether this is a delimLine with flags.
        // if so, the
        [
          /(^%% *)(\w+)( +[\w "{}:=]*)$/,
          [
            {
              token: "iomd-type",
              log: `delimLine type+flags-- [$0, $1, $2] in state [$S0, $S1, $S2]`
            },
            "iomd-type",
            delimEOL("iomd-flag", "$2")
          ]
        ],
        [
          /(^%% *)(\w+) *$/,
          [
            {
              token: "iomd-type",
              log: `delimLine just type-- [$0, $1, $2] in state [$S0, $S1, $S2]`
            },
            delimEOL("iomd-type", "$2")
          ]
        ],
        [/^%% *$/, delimEOL("iomd-type", "$S2")]
      ],
      embed: [
        [
          // NB: something weird about this regex -- it only correctly matches
          // at the start-of-line when wrapped in a capture group. :-/    ????
          /(^%%.*$)/,
          {
            token: "@rematch",
            next: "@delimLine.$S2",
            nextEmbedded: "@pop",
            log: "embedded %%-- state [$S0, $S1, $S2], matches '$0'"
          }
        ]
      ]
    }
  };
  //     embed: [
  //       [
  //         // /^\%\%$/,
  //         new RegExp("^%%$"),
  //         {
  //           token: "@rematch",
  //           next: "@pop",
  //           // nextEmbedded: "@pop",
  //           log:
  //             "START AND END %% matched [$0, $1, $2] in state [$S0, $S1, $S2]"
  //         }
  //       ],
  //       // [
  //       //   /^(%)(%)/,
  //       //   {
  //       //     token: "@rematch",
  //       //     next: "@pop",
  //       //     // nextEmbedded: "@pop",
  //       //     log:
  //       //       "START AND END GROUPED matched [$0, $1, $2] in state [$S0, $S1, $S2]"
  //       //   }
  //       // ],
  //       // [
  //       //   /^%%/,
  //       //   {
  //       //     token: "@rematch",
  //       //     next: "@pop",
  //       //     // nextEmbedded: "@pop",
  //       //     log: "start %% matched [$0, $1, $2] in state [$S0, $S1, $S2]"
  //       //   }
  //       // ],
  //       //   matches a delimLine that is all whatspace to EOL
  //       // e.g. has no explicit type or flags.
  //       [
  //         /^%% *$/,
  //         {
  //           token: "iomd-type",
  //           log: "NO TYPE matched [$0, $1, $2] in state [$S0, $S1, $S2]"
  //         }
  //       ],
  //       // matches a delimLine with that is not all whitespace to EOL
  //       // e.g., that has type or flags.
  //       // In this case, pop and rematch
  //       [
  //         /^%% *[^ ].*$/,
  //         {
  //           token: "@rematch",
  //           log: "with type matched [$0, $1, $2] in state [$S0, $S1, $S2]",
  //           next: "@pop",
  //           nextEmbedded: "@pop"
  //         }
  //       ]
  //     ]
  //   }
  // };

  // Object.entries(embedModes).forEach(([modeName, modeOpts]) => {
  //   JSON.stringify(modeOpts);
  //   // add a matcher to `root` that will look for a modename and
  //   //
  //   language.tokenizer.root.push([
  //     new RegExp(`^%% *${modeName}`),
  //     {
  //       token: "@rematch" /* "iomd-type" */,
  //       next: `@${modeName}DelimLine`,
  //       log: `root: @${modeName}DelimLine -- [$0, $1, $2] in state [$S0, $S1, $S2]`
  //     }
  //   ]);

  //   language.tokenizer[`${modeName}DelimLine`] = [
  //     // match lines with modename but no flags (whitespace to EOL)
  //     [
  //       new RegExp(`^%% *${modeName} *$`),
  //       { token: "iomd-type", next: "@embed", nextEmbedded: modeName }
  //     ],
  //     // match lines with modename not whitespace to the end of the line
  //     [new RegExp(`^%% *${modeName} *`), { token: "iomd-type" }],
  //     // matches a delimLine that is all whatspace to EOL
  //     // e.g. has no explicit type or flags.
  //     [/^%% *$/, { token: "iomd-type" }],
  //     // matches a delimLine with that is not all whitespace to EOL
  //     // e.g., that has type or flags.
  //     // In this case, pop and rematch
  //     [/^%% *[^ ].*$/, { token: "@rematch", next: "@pop" }],
  //     // matches all tokens to the end of the line
  //     [
  //       /["":{}} \w]*$/,
  //       {
  //         token: "iomd-flag",
  //         next: "@embed.$S1",
  //         log: "EOL matched [$0, $1, $2] in state [$S0, $S1, $S2]",
  //         nextEmbedded: modeName
  //       }
  //     ]
  //   ];
  // });
  return language;
}

// export function compileIomdLanguageDef(embedModes) {
//   const language = {
//     ignoreCase: true,
//     tokenizer: {
//       root: []
//     }
//   };

//   Object.entries(embedModes).forEach(([modeName, modeOpts]) => {
//     JSON.stringify(modeOpts);
//     // add a matcher to `root` that will look for a modename and
//     //
//     language.tokenizer.root.push([
//       new RegExp(`^%% *${modeName}`),
//       { token: "@rematch" /* "iomd-type" */, next: `@${modeName}DelimLine` }
//     ]);

//     language.tokenizer[`${modeName}DelimLine`] = [
//       // match lines with modename but no flags (whitespace to EOL)
//       [
//         new RegExp(`^%% *${modeName} *$`),
//         { token: "iomd-type", next: "@embed", nextEmbedded: modeName }
//       ],
//       // match lines with modename not whitespace to the end of the line
//       [new RegExp(`^%% *${modeName} *`), { token: "iomd-type" }],
//       // matches a delimLine that is all whatspace to EOL
//       // e.g. has no explicit type or flags.
//       [/^%% *$/, { token: "iomd-type" }],
//       // matches a delimLine with that is not all whitespace to EOL
//       // e.g., that has type or flags.
//       // In this case, pop and rematch
//       [/^%% *[^ ].*$/, { token: "@rematch", next: "@pop" }],
//       // matches all tokens to the end of the line
//       [
//         /["":{}} \w]*$/,
//         {
//           token: "iomd-flag",
//           next: "@embed",
//           log: "EOL matched [$0, $1, $2] in state [$S0, $S1, $S2]",
//           nextEmbedded: modeName
//         }
//       ]
//     ];

//     language.tokenizer[`${modeName}Embedded`] = [
//       [
//         /^%% *[^ ].*$/,
//         {
//           token: "@rematch",
//           log:
//             "with type matched [$0, $1, $2] in state [$S0, $S1, $S2]",
//           next: "@pop",
//           nextEmbedded: "@pop"
//         }
//       ]
//     ]

//   });

//   return language;
// }

const embedModes = { js: {}, md: {}, py: {}, css: {}, fetch: {} };

export const language = compileIomdLanguageDef(embedModes);

export const conf = {
  // eslint-disable-next-line
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,
  // comments: {
  //   blockComment: ["<!--", "-->"]
  // },
  // brackets: [["<!--", "-->"], ["<", ">"], ["{", "}"], ["(", ")"]],
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
  //     start: new RegExp("^%%"),
  //     end: new RegExp("^%%")
  //   }
  // }
};
