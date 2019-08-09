const delimEOL = (token, nextEmbedded) => ({
  cases: {
    [`${nextEmbedded}@embedModes`]: {
      token,
      nextEmbedded,
      next: `@embed.${nextEmbedded}`
    },
    "@default": { token, next: "@popall" }
  }
});

export function compileIomdLanguageDef(embedModes) {
  const language = {
    ignoreCase: true,
    embedModes: Object.keys(embedModes),
    tokenizer: {
      root: [[/(^%%.*$)/, { token: "@rematch", next: `@delimLine` }]],

      delimLine: [
        // first, check whether this is a delimLine with flags.
        // if so, the
        [
          /(^%%+)( *)(\w+)( +[\w "{}:=]*)$/,
          [
            {
              token: "iomd-type",
              log: "capt groups 1:`$1`, 2:`$2`, 3:`$3`, 4:`$4`, -- state `$S1`"
            },
            "iomd-type",
            "iomd-type",
            delimEOL("iomd-flag", "$3")
          ]
        ],
        [
          /(^%%+ *)(\w+) *$/,
          [{ token: "iomd-type" }, delimEOL("iomd-type", "$2")]
        ],
        // a delim line with only spaces returns to the nextEmbedded
        // that is in the $S2 position in the current delimLine state
        [/^%%+ *$/, delimEOL("iomd-type", "$S2")]
      ],

      embed: [
        [
          // NB: something weird about this regex -- it only correctly matches
          // at the start-of-line when wrapped in a capture group. :-/    ????
          /(^%%.*$)/,
          { token: "@rematch", next: "@delimLine.$S2", nextEmbedded: "@pop" }
        ]
      ]
    }
  };

  return language;
}

const embedModes = { js: {}, md: {}, py: {}, css: {}, fetch: {} };

export const language = compileIomdLanguageDef(embedModes);

export const conf = {
  // eslint-disable-next-line
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,

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

  // folding: {
  //   markers: {
  //     start: new RegExp("^%%"),
  //     end: new RegExp("^%%")
  //   }
  // }
};
