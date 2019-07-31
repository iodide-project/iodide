import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

const EMPTY_ELEMENTS = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "menuitem",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];

//

//

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
  // surroundingPairs: [
  //   { open: '"', close: '"' },
  //   { open: "'", close: "'" },
  //   { open: "{", close: "}" },
  //   { open: "[", close: "]" },
  //   { open: "(", close: ")" },
  //   { open: "<", close: ">" }
  // ],
  onEnterRules: [
    {
      beforeText: new RegExp(
        // eslint-disable-next-line
        "<(?!(?:" +
          EMPTY_ELEMENTS.join("|") +
          "))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$",
        "i"
      ),
      afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>$/i,
      action: { indentAction: monaco.languages.IndentAction.IndentOutdent }
    },
    {
      beforeText: new RegExp(
        // eslint-disable-next-line
        "<(?!(?:" +
          EMPTY_ELEMENTS.join("|") +
          "))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$",
        "i"
      ),
      action: { indentAction: monaco.languages.IndentAction.Indent }
    }
  ],
  folding: {
    markers: {
      start: new RegExp("^\\s*<!--\\s*#region\\b.*-->"),
      end: new RegExp("^\\s*<!--\\s*#endregion\\b.*-->")
    }
  }
};

//

//

//

export const language = {
  defaultToken: "",
  tokenPostfix: ".html",
  ignoreCase: true,
  // The main tokenizer for our languages
  tokenizer: {
    root: [
      [/<!DOCTYPE/, "metatag", "@doctype"],
      [/<!--/, "comment", "@comment"],
      [
        // eslint-disable-next-line
        /(<)((?:[\w\-]+:)?[\w\-]+)(\s*)(\/>)/,
        ["delimiter", "tag", "", "delimiter"]
      ],
      [/(<)(script)/, ["delimiter", { token: "tag", next: "@script" }]],
      [/(<)(style)/, ["delimiter", { token: "tag", next: "@style" }]],
      [
        // eslint-disable-next-line
        /(<)((?:[\w\-]+:)?[\w\-]+)/,
        ["delimiter", { token: "tag", next: "@otherTag" }]
      ],
      [
        // eslint-disable-next-line
        /(<\/)((?:[\w\-]+:)?[\w\-]+)/,
        ["delimiter", { token: "tag", next: "@otherTag" }]
      ],
      [/</, "delimiter"],
      [/[^<]+/]
    ],
    doctype: [[/[^>]+/, "metatag.content"], [/>/, "metatag", "@pop"]],
    comment: [
      [/-->/, "comment", "@pop"],
      [/[^-]+/, "comment.content"],
      [/./, "comment.content"]
    ],
    otherTag: [
      [/\/?>/, "delimiter", "@pop"],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      // eslint-disable-next-line
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [/[ \t\r\n]+/]
    ],
    // -- BEGIN <script> tags handling
    // After <script
    script: [
      // [/type/, "attribute.name", "@scriptAfterType"],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      // eslint-disable-next-line
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [
        />/,
        {
          token: "delimiter",
          next: "@scriptEmbedded",
          nextEmbedded: "js",
          log: "script '>' matched -- [$0, $1, $2] in state [$S0, $S1, $S2]"
        }
      ],
      [/[ \t\r\n]+/],
      [
        /(<\/)(script\s*)(>)/,
        ["delimiter", "tag", { token: "delimiter", next: "@pop" }]
      ]
    ],
    // After <script ... type
    // scriptAfterType: [
    //   [/=/, "delimiter", "@scriptAfterTypeEquals"],
    //   [
    //     />/,
    //     {
    //       token: "delimiter",
    //       next: "@scriptEmbedded",
    //       nextEmbedded: "js"
    //     }
    //   ],
    //   [/[ \t\r\n]+/],
    //   [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
    // ],
    // After <script ... type =
    // scriptAfterTypeEquals: [
    //   [
    //     /"([^"]*)"/,
    //     { token: "attribute.value", switchTo: "@scriptWithCustomType.$1" }
    //   ],
    //   [
    //     /'([^']*)'/,
    //     { token: "attribute.value", switchTo: "@scriptWithCustomType.$1" }
    //   ],
    //   [
    //     />/,
    //     {
    //       token: "delimiter",
    //       next: "@scriptEmbedded",
    //       nextEmbedded: "js"
    //     }
    //   ],
    //   [/[ \t\r\n]+/],
    //   [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
    // ],
    // After <script ... type = $S2
    // scriptWithCustomType: [
    //   [
    //     />/,
    //     { token: "delimiter", next: "@scriptEmbedded.$S2", nextEmbedded: "$S2" }
    //   ],
    //   [/"([^"]*)"/, "attribute.value"],
    //   [/'([^']*)'/, "attribute.value"],
    //   // eslint-disable-next-line
    //   [/[\w\-]+/, "attribute.name"],
    //   [/=/, "delimiter"],
    //   [/[ \t\r\n]+/],
    //   [/<\/script\s*>/, { token: "@rematch", next: "@pop" }]
    // ],
    scriptEmbedded: [
      [
        /<\/script/,
        {
          token: "@rematch",
          next: "@pop",
          nextEmbedded: "@pop",
          log:
            "scriptEmbedded /</script/ matched -- [$0, $1, $2] in state [$S0, $S1, $S2]"
        }
      ],
      [/[^<]+/, ""]
    ],
    // -- END <script> tags handling
    // -- BEGIN <style> tags handling
    // After <style
    style: [
      [/type/, "attribute.name", "@styleAfterType"],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      // eslint-disable-next-line
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [
        />/,
        { token: "delimiter", next: "@styleEmbedded", nextEmbedded: "css" }
      ],
      [/[ \t\r\n]+/],
      [
        /(<\/)(style\s*)(>)/,
        ["delimiter", "tag", { token: "delimiter", next: "@pop" }]
      ]
    ],
    // After <style ... type
    styleAfterType: [
      [/=/, "delimiter", "@styleAfterTypeEquals"],
      [
        />/,
        { token: "delimiter", next: "@styleEmbedded", nextEmbedded: "css" }
      ],
      [/[ \t\r\n]+/],
      [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    // After <style ... type =
    styleAfterTypeEquals: [
      [
        /"([^"]*)"/,
        { token: "attribute.value", switchTo: "@styleWithCustomType.$1" }
      ],
      [
        /'([^']*)'/,
        { token: "attribute.value", switchTo: "@styleWithCustomType.$1" }
      ],
      [
        />/,
        { token: "delimiter", next: "@styleEmbedded", nextEmbedded: "css" }
      ],
      [/[ \t\r\n]+/],
      [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    // After <style ... type = $S2
    styleWithCustomType: [
      [
        />/,
        { token: "delimiter", next: "@styleEmbedded.$S2", nextEmbedded: "$S2" }
      ],
      [/"([^"]*)"/, "attribute.value"],
      [/'([^']*)'/, "attribute.value"],
      // eslint-disable-next-line
      [/[\w\-]+/, "attribute.name"],
      [/=/, "delimiter"],
      [/[ \t\r\n]+/],
      [/<\/style\s*>/, { token: "@rematch", next: "@pop" }]
    ],
    styleEmbedded: [
      [/<\/style/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }],
      [/[^<]+/, ""]
    ]
  }
};
