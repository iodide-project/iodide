import { getCompletionScope } from "../code-completion-request-response";

/* eslint-disable no-irregular-whitespace */
const testExpressions = [
  { expr: ``, scope: [] },

  { expr: `   `, scope: [] },
  { expr: `const foo    `, scope: [] },
  { expr: `const foo =`, scope: [] },
  { expr: `const foo =      `, scope: [] },
  { expr: `[`, scope: [] },
  { expr: `let x = fn(`, scope: [] },
  {
    expr: `function parseExpression(code, cursorPos) {
    var expression = code.slice(0, cursorPos);
    if (!expression ||
        whitespaceRE.te`,
    scope: ["whitespaceRE"]
  },

  {
    expr: `function foo(){
  a = {
    fo`,
    scope: []
  },

  {
    expr: `const fetchLineSuggestion = (lineSoFar, fileNames) => {
  let suggestions;
  if (lineSoFar.match(/\w+:`, // eslint-disable-line
    scope: []
  },

  {
    expr: `const fetchLineSuggestion = (lineSoFar, fileNames) => {
  let suggestions;
  if (lineSoFar.ma`,
    scope: ["lineSoFar"]
  },

  { expr: `Object.entr`, scope: ["Object"] },

  {
    expr: `monaco.languages.registerCompletion`,
    scope: ["monaco", "languages"]
  },

  { expr: `a.b["c"].d`, scope: ["a", "b", "c"] },

  { expr: `a.b["c"].d.`, scope: ["a", "b", "c", "d"] },
  { expr: `a.b['c'].d.`, scope: ["a", "b", "c", "d"] },
  { expr: `a.b[32].`, scope: ["a", "b", "32"] },
  { expr: `a.b[32][54].d.`, scope: ["a", "b", "32", "54", "d"] },

  { expr: `a.b["c c"].d[`, scope: [] },
  { expr: `a.b["c c"].d["`, scope: ["a", "b", "c c", "d"] },
  { expr: `a.b["c c"].d['`, scope: ["a", "b", "c c", "d"] },
  { expr: 'a.b["c c"].d[`', scope: ["a", "b", "c c", "d"] },
  { expr: "a.b['c c'].d[`", scope: ["a", "b", "c c", "d"] },
  { expr: "a.b[`c c`].d[`", scope: ["a", "b", "c c", "d"] },
  {
    expr: `a
   .b.c
   .d
   .e`,
    scope: ["a", "b", "c", "d"]
  },
  {
    expr: `a
   .b.c
   .d
   .e`,
    scope: ["a", "b", "c", "d"]
  },
  {
    expr: `a
   .b["c"]
   .d['`,
    scope: ["a", "b", "c", "d"]
  },
  { expr: `a.b["c"].d["foo`, scope: ["a", "b", "c", "d"] },
  { expr: `a.b["c"].d[\`foo`, scope: ["a", "b", "c", "d"] },
  { expr: `a.b["c"].d['foo`, scope: ["a", "b", "c", "d"] },
  { expr: `a.b["c"].d["foo"`, scope: [] },
  { expr: `a.b["c"].d["foo"]`, scope: [] },
  { expr: `a.b["c"].d[(() => "foo")()].e`, scope: [] },

  {
    expr: `function foo(){
  a = {
    foo:13
    }
  a.b["c"].d`,
    // note: dealing with `a` being redefined in this
    // function is too complicated; just searching global
    // scope is fine
    scope: ["a", "b", "c"]
  }
];
/* eslint-enable no-irregular-whitespace */

describe("delimLineSuggestion", () => {
  testExpressions.forEach(({ expr, scope }, i) => {
    const caseScope = getCompletionScope(expr);
    it(`Should give correct scope for case ${i}, expression:\n\`${expr}\``, () => {
      expect(caseScope).toEqual(scope);
    });
  });
});
