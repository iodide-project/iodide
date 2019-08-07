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
            token: "@rematch",
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
