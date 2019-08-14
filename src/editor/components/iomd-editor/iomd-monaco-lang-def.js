const delimEolToken = (token, nextEmbedded) => ({
  // this function is used to set the nextEmbedded options
  // for the final token of  delimLime
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
        [
          // first, check whether this is a delimLine with flags.
          // the "$3" capture group is the next embedded type
          /(^%%+)( *)(\w+)( +[\w "{}:=]*)$/,
          [
            "iomd-type",
            "iomd-type",
            "iomd-type",
            delimEolToken("iomd-flag", "$3")
          ]
        ],
        [
          // next, check for delimLine with only a type and whitespace.
          // the "$2" capture group is the next embedded type
          /(^%%+ *)(\w+) *$/,
          ["iomd-type", delimEolToken("iomd-type", "$2")]
        ],
        [
          // finally delimLine with only spaces returns to the nextEmbedded
          // that is in the $S2 position in the current delimLine state
          /^%%+ *$/,
          delimEolToken("iomd-type", "$S2")
        ]
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
};
