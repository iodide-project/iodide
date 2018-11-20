/* global it describe expect */
import {
  parseJsmd,
  stateFromJsmd,
  jsmdValidCellTypes,
} from '../jsmd-tools'
import { newNotebook } from '../../editor-state-prototypes'

let jsmdTestCase = `%% meta
{"title": "What a web notebook looks like",
"viewMode": "editor",
"lastExport": "2017-12-13T17:46:16.207Z",
"jsmdVersionHash": "42-example_hash_1234567890",
"jsmdPreviousVersionHash": "41-example_hash_prev_1234567890",
"iodideAppVersion": "0.0.1",
"iodideAppLocation": "https://some.cdn.com/path/version/iodideApp.js"
}

%% md
## Markdown cell

This is written in a **Markdown cell**, which supports normal _MD formating)_
Markdown cells also support Latex

$$
X_{t,i}
$$

%% js
// this is a JS code cell. We can use normal JS and browser APIs.
range = []
for (let i=0; i<10; i++){range.push(i)}
A = range.map( (x,i) => range.map( (y,j) => (Math.random()+i-.5)))

%% raw
this is a raw cell. it's available in jupyter, so we have it too. not clear what the use case is, but it's here in case you want it. notice that raw cells don't wrap (unlike MD cell editors)

%% md
## css cell
the cell below allows you to add styles to your report

%% css
.text {text-align:center;}

%% js
// above this is a DOM cell, which we can also target
spinCubeInTarget("#dom-cell-2")`

describe('jsmd parser Ex 1', () => {
  const { parseWarnings } = parseJsmd(jsmdTestCase)
  const state = stateFromJsmd(jsmdTestCase)

  it('should have zero parse warnings', () => {
    expect(parseWarnings.length).toEqual(0)
  })

  it('should have correct meta settings: title', () => {
    expect(state.title).toEqual('What a web notebook looks like')
  })
  it('should have correct meta settings: viewMode', () => {
    expect(state.viewMode).toEqual('EXPLORE_VIEW')
  })
})


jsmdTestCase = `

%% js
foo
%% JS       {"skipInRunAll":true}
foo
%%Js
foo

%%    jS     {"skipInRunAll":false}

foo

`

describe('jsmd parser test case 3', () => {
  const jsmdParsed = parseJsmd(jsmdTestCase)
  const { parseWarnings } = jsmdParsed

  it('should have zero parse warnings', () => {
    expect(parseWarnings.length).toEqual(0)
  })
  it('parseWarnings should be an empty array', () => {
    expect(parseWarnings).toEqual([])
  })
})


// this case is for an observed bug
jsmdTestCase = `
%% js
`
describe('jsmd parser test case 4', () => {
  const jsmdParsed = parseJsmd(jsmdTestCase)
  const { parseWarnings } = jsmdParsed

  it('should have zero parse warnings', () => {
    expect(parseWarnings.length).toEqual(0)
  })
})


// test error parsing and bad cell type conversion
jsmdTestCase = `
%% js {"collapseEditViewInput": badjson%@#$^
foo
%% js {"badcellsettingkey": "SCROLLABLE", "skipInRunAll":true}
foo
%% badcelltype {"skipInRunAll":true}
foo
`
describe('jsmd parser test case 5, error parsing and bad cell type conversion', () => {
  const jsmdParsed = parseJsmd(jsmdTestCase)
  const { parseWarnings } = jsmdParsed
  it('should have 3 parse warnings', () => {
    expect(parseWarnings.length).toEqual(3)
  })
})


jsmdTestCase = `
%% meta
invalid_json_content for meta setings
`
describe('jsmd parser test case 6, bad meta parsing and creation of default JS cell', () => {
  const jsmdParsed = parseJsmd(jsmdTestCase)
  const state = stateFromJsmd(jsmdTestCase)
  const { parseWarnings } = jsmdParsed
  it('should have 1 parse warning1', () => {
    expect(parseWarnings.length).toEqual(1)
  })
  it('state should be a default notebook with no additions', () => {
    expect(state).toEqual(newNotebook())
  })
})

// test multiple cell settings
jsmdTestCase = `
%% js {"language": "VALUE_1", "skipInRunAll":"VALUE_2"}
test cell
%% js {"language": "VALUE_3","skipInRunAll":true}
test cell
`
describe('jsmd parser test case 7, cell settings', () => {
  const jsmdParsed = parseJsmd(jsmdTestCase)
  const { parseWarnings } = jsmdParsed
  it('should have 0 parse warnings', () => {
    expect(parseWarnings.length).toEqual(0)
  })
})


jsmdTestCase = `
%% js


foo
foo
foo


foo




foo




`
describe('jsmd parser test case 7, multi line cell content should parse ok', () => {
  const jsmdParsed = parseJsmd(jsmdTestCase)
  const { parseWarnings } = jsmdParsed
  it('should have 0 parse warnings', () => {
    expect(parseWarnings.length).toEqual(0)
  })
})


describe('jsmd parser test case 7, non-js code cells should parse ok', () => {
  jsmdTestCase = `
%% code {"language":"python"}
foo`
  const jsmdParsed = parseJsmd(jsmdTestCase)
  const { parseWarnings } = jsmdParsed
  it('should have 0 parse warnings', () => {
    expect(parseWarnings.length).toEqual(0)
  })
})

describe('all jsmdValidCellTypes (including legacy cell types) should convert to a state-prototypes cell type', () => {
  jsmdValidCellTypes.forEach((cellTypeStr) => {
    jsmdTestCase = `
%% ${cellTypeStr}
foo`
    const jsmdParsed = parseJsmd(jsmdTestCase)
    const { parseWarnings } = jsmdParsed
    it(`should have 0 parse warnings (cell type: ${cellTypeStr})`, () => {
      expect(parseWarnings.length).toEqual(0)
    })
  })
})
