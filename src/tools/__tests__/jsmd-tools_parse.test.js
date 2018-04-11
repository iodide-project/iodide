/* global it describe expect */
import { parseJsmd,
  stateFromJsmd,
  jsmdValidCellTypes,
  jsmdToCellTypeMap,
} from '../jsmd-tools'
import {
  newNotebook,
  cellTypeEnum,
} from '../../state-prototypes'

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

%% js {"rowSettings.REPORT.input": "SCROLL", "rowSettings.REPORT.output": "VISIBLE"}
// this is a JS code cell. We can use normal JS and browser APIs.
range = []
for (let i=0; i<10; i++){range.push(i)}
A = range.map( (x,i) => range.map( (y,j) => (Math.random()+i-.5)))

%% raw
this is a raw cell. it's available in jupyter, so we have it too. not clear what the use case is, but it's here in case you want it. notice that raw cells don't wrap (unlike MD cell editors)

%% md
## External resource cell
the cell below allows you to load external scripts

%% resource
https://cdnjs.cloudflare.com/ajax/libs/three.js/88/three.min.js

%% css
.text {text-align:center;}

%% js
// above this is a DOM cell, which we can also target
spinCubeInTarget("#dom-cell-2")`

describe('jsmd parser Ex 1', () => {
  const { parseWarnings } = parseJsmd(jsmdTestCase)
  const state = stateFromJsmd(jsmdTestCase)
  const { cells } = state
  // const { parseWarnings } = jsmdParsed

  it('new cells should start with "\n%%" or "%%" at the start of the file. drop empty cells.', () => {
    expect(cells.length).toEqual(7)
  })
  it('should have correct cell types', () => {
    expect(cells.map(c => c.cellType)).toEqual([
      'markdown', 'code', 'raw', 'markdown', 'external dependencies', 'css', 'code',
    ])
  })
  it('should have zero parse warnings', () => {
    expect(parseWarnings.length).toEqual(0)
  })
  it('cell 2 should have settings (1 of 2) "rowSettings.REPORT.input": "SCROLL"', () => {
    expect(cells[1].rowSettings.REPORT.input).toEqual('SCROLL')
  })
  it('cell 2 should have settings (2 of 2) "rowSettings.REPORT.output": "VISIBLE"', () => {
    expect(cells[1].rowSettings.REPORT.output).toEqual('VISIBLE')
  })
  it('should have correct meta settings: title', () => {
    expect(state.title).toEqual('What a web notebook looks like')
  })
  it('should have correct meta settings: viewMode', () => {
    expect(state.viewMode).toEqual('editor')
  })
})


jsmdTestCase = `

%% js
foo
%% JS       {"rowSettings.REPORT.input":"SCROLL"}
foo
%%Js
foo

%%    jS     {"rowSettings.REPORT.output":"VISIBLE"}

foo

`

describe('jsmd parser test case 3', () => {
  const jsmdParsed = parseJsmd(jsmdTestCase)
  const state = stateFromJsmd(jsmdTestCase)
  const { cells } = state
  const { parseWarnings } = jsmdParsed

  it('should have 4 cells and not trip up on caps or whitespace', () => {
    expect(cells.length).toEqual(4)
  })
  it('should have zero parse warnings', () => {
    expect(parseWarnings.length).toEqual(0)
  })
  it('parseWarnings should be an empty array', () => {
    expect(parseWarnings).toEqual([])
  })
  it('all cells should have cellType==js', () => {
    expect(cells.map(c => c.cellType)).toEqual(expect.arrayContaining(['code']))
  })
  it('all cells should have content=="foo"', () => {
    expect(cells.map(c => c.content)).toEqual(expect.arrayContaining(['foo']))
  })
})


// this case is for an observed bug
jsmdTestCase = `
%% js
`
describe('jsmd parser test case 4', () => {
  const jsmdParsed = parseJsmd(jsmdTestCase)
  const state = stateFromJsmd(jsmdTestCase)
  const { cells } = state
  const { parseWarnings } = jsmdParsed

  it('should have 1 cell', () => {
    expect(cells.length).toEqual(1)
  })
  it('should have zero parse warnings', () => {
    expect(parseWarnings.length).toEqual(0)
  })
  it('cell 0 should have no content', () => {
    expect(cells[0].content).toEqual('')
  })
})


// test error parsing and bad cell type conversion
jsmdTestCase = `
%% js {"collapseEditViewInput": badjson%@#$^
foo
%% js {"badcellsettingkey": "SCROLLABLE", "rowSettings.REPORT.output":"VISIBLE"}
foo
%% badcelltype {"rowSettings.REPORT.input":"SCROLL_carrots"}
foo
`
describe('jsmd parser test case 5, error parsing and bad cell type conversion', () => {
  const jsmdParsed = parseJsmd(jsmdTestCase)
  const state = stateFromJsmd(jsmdTestCase)
  const { cells } = state
  const { parseWarnings } = jsmdParsed
  it('should have 3 parse warnings', () => {
    expect(parseWarnings.length).toEqual(3)
  })
  it('all cells should have cellType==js (bad cellTypes should convert to js)', () => {
    expect(cells.map(c => c.cellType)).toEqual(['code', 'code', 'code'])
  })
  it('cell 1 should have "rowSettings.REPORT.output":"VISIBLE"', () => {
    expect(cells[1].rowSettings.REPORT.output).toEqual('VISIBLE')
  })
  it('cell 2 should have "rowSettings.REPORT.output"=="SCROLL"', () => {
    expect(cells[2].rowSettings.REPORT.input).toEqual('SCROLL_carrots')
  })
  it('all cells should have content=="foo"', () => {
    expect(cells.map(c => c.content)).toEqual(expect.arrayContaining(['foo']))
  })
})


jsmdTestCase = `
%% meta
invalid_json_content for meta setings
`
describe('jsmd parser test case 6, bad meta parsing and creation of default JS cell', () => {
  const jsmdParsed = parseJsmd(jsmdTestCase)
  const state = stateFromJsmd(jsmdTestCase)
  const { cells } = state
  const { parseWarnings } = jsmdParsed
  it('should have 1 cells (%% meta is not converted to a cell)', () => {
    expect(cells.length).toEqual(1)
  })
  it('should have 1 parse warning1', () => {
    expect(parseWarnings.length).toEqual(1)
  })
  it('the cells should have cellType==js (bad cellTypes should convert to code)', () => {
    expect(cells.map(c => c.cellType)).toEqual(['code'])
  })
  it('state should be a default notebook with no additions', () => {
    expect(state).toEqual(newNotebook())
  })
})

// test multiple cell settings
jsmdTestCase = `
%% js {"rowSettings.REPORT.input": "VALUE_1", "rowSettings.REPORT.output":"VALUE_2"}
test cell
%% js {"rowSettings.REPORT.input": "VALUE_1","skipInRunAll":true}
test cell
`
describe('jsmd parser test case 7, cell settings', () => {
  const jsmdParsed = parseJsmd(jsmdTestCase)
  const state = stateFromJsmd(jsmdTestCase)
  const { cells } = state
  const { parseWarnings } = jsmdParsed
  it('should have 2 cells', () => {
    expect(cells.length).toEqual(2)
  })
  it('should have 0 parse warnings', () => {
    expect(parseWarnings.length).toEqual(0)
  })
  it('cell 0 should have "rowSettings.REPORT.input":"VALUE_1"', () => {
    expect(cells[0].rowSettings.REPORT.input).toEqual('VALUE_1')
  })
  it('cell 0 should have "rowSettings.REPORT.output"=="VALUE_2"', () => {
    expect(cells[0].rowSettings.REPORT.output).toEqual('VALUE_2')
  })
  it('cell 1 should have "skipInRunAll"===true', () => {
    expect(cells[1].skipInRunAll).toEqual(true)
  })
  it('all cells should have content=="test cell"', () => {
    expect(cells.map(c => c.content)).toEqual(expect.arrayContaining(['test cell']))
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
  const state = stateFromJsmd(jsmdTestCase)
  const { cells } = state
  const { parseWarnings } = jsmdParsed
  it('should have 1 cells', () => {
    expect(cells.length).toEqual(1)
  })
  it('should have 0 parse warnings', () => {
    expect(parseWarnings.length).toEqual(0)
  })
  it('multi line cell content should parse ok', () => {
    expect(cells[0].content).toEqual(`foo
foo
foo


foo




foo`)
  })
})


describe('jsmd parser test case 7, non-js code cells should parse ok', () => {
  jsmdTestCase = `
%% code {"language":"python"}
foo`
  const jsmdParsed = parseJsmd(jsmdTestCase)
  const state = stateFromJsmd(jsmdTestCase)
  const { cells } = state
  const { parseWarnings } = jsmdParsed
  it('should have 1 cells', () => {
    expect(cells.length).toEqual(1)
  })
  it('should have 0 parse warnings', () => {
    expect(parseWarnings.length).toEqual(0)
  })
  it('cell content should parse ok', () => {
    expect(cells[0].content).toEqual('foo')
  })
  it('cell type parse ok', () => {
    expect(cells[0].cellType).toEqual('code')
  })
  it('cell language parse ok', () => {
    expect(cells[0].language).toEqual('python')
  })
})

describe('all jsmdValidCellTypes (including legacy cell types) should convert to a state-prototypes cell type', () => {
  jsmdValidCellTypes.forEach((cellTypeStr) => {
    jsmdTestCase = `
%% ${cellTypeStr}
foo`
    const jsmdParsed = parseJsmd(jsmdTestCase)
    const state = stateFromJsmd(jsmdTestCase)
    const { cells } = state
    const { parseWarnings } = jsmdParsed
    it(`should have 1 cell (cell type: ${cellTypeStr})`, () => {
      expect(cells.length).toEqual(1)
    })
    it(`should have 0 parse warnings (cell type: ${cellTypeStr})`, () => {
      expect(parseWarnings.length).toEqual(0)
    })
    it(`cell content should parse ok (cell type: ${cellTypeStr})`, () => {
      expect(cells[0].content).toEqual('foo')
    })
    it(`jsmd cell type parse to expected cell type (cell type: ${cellTypeStr})`, () => {
      expect(cells[0].cellType).toEqual(jsmdToCellTypeMap.get(cellTypeStr))
    })
    it(`jsmd cell type parse to a state-prototypes cell type (cell type: ${cellTypeStr})`, () => {
      expect(cellTypeEnum.values()).toContain(cells[0].cellType)
    })
  })
})
