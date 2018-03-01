/* global it describe expect */
import { parseJsmd,
  jsmdValidCellTypes,
  stringifyStateToJsmd } from './../src/jsmd-tools'

import { newNotebook, newCell } from '../src/state-prototypes'


// this can be defined once for all test cases
const exportAt = new Date().toISOString()

let jsmdTestCase = `%% meta
{"title": "What a web notebook looks like",
"viewMode": "editor",
"lastExport": "2017-12-13T17:46:16.207Z",
"jsmdVersionHash": "42-example_hash_1234567890",
"jsmdPreviousVersionHash": "41-example_hash_prev_1234567890",
"iodideAppVersion": "0.0.1",
"iodideAppLocation": "https://some.cdn.com/path/version/iodideApp.js"
}

%% md {"collapseEditViewInput": "SCROLLABLE", "collapseEditViewOutput": "COLLAPSED"}
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
## External resource cell
the cell below allows you to load external scripts

%% resource
https://cdnjs.cloudflare.com/ajax/libs/three.js/88/three.min.js

%% js
// above this is a DOM cell, which we can also target
spinCubeInTarget("#dom-cell-2")`

const jsmdEx1Meta = {
  title: 'What a web notebook looks like',
  viewMode: 'editor',
  lastExport: '2017-12-13T17:46:16.207Z',
  jsmdVersionHash: '42-example_hash_1234567890',
  jsmdPreviousVersionHash: '41-example_hash_prev_1234567890',
  iodideAppVersion: '0.0.1',
  iodideAppLocation: 'https://some.cdn.com/path/version/iodideApp.js',
}

describe('jsmd parser Ex 1', () => {
  const jsmdParsed = parseJsmd(jsmdTestCase)
  const { cells } = jsmdParsed
  const { parseWarnings } = jsmdParsed
  it('new cells should start with "\n%%" or "%%" at the start of the file. drop empty cells.', () => {
    expect(cells.length).toEqual(7)
  })
  it('should have correct cell types', () => {
    expect(cells.map(c => c.cellType)).toEqual(['meta', 'md', 'js', 'raw', 'md', 'resource', 'js'])
  })
  it('should only have cell settings in the jsmdValidCellSettings list', () => {
    expect(cells.map(c => c.cellType)).toEqual(expect.arrayContaining(jsmdValidCellTypes))
  })
  it('should have zero parse warnings', () => {
    expect(parseWarnings.length).toEqual(0)
  })
  it('cell 1 should have settings {"collapseEditViewInput": "SCROLLABLE", "collapseEditViewOutput": "COLLAPSED"}', () => {
    expect(cells[1].settings).toEqual({ collapseEditViewInput: 'SCROLLABLE', collapseEditViewOutput: 'COLLAPSED' })
  })
  it('should have correct meta settings', () => {
    expect(cells.filter(c => c.cellType === 'meta')[0].content).toEqual(jsmdEx1Meta)
  })
})


jsmdTestCase = `

%% js
foo
%% JS       {"collapseEditViewInput": "SCROLLABLE"}
foo
%%Js
foo

%%    jS     {"collapseEditViewInput": "SCROLLABLE"}

foo

`

describe('jsmd parser test case 3', () => {
  const jsmdParsed = parseJsmd(jsmdTestCase)
  const { cells } = jsmdParsed
  const { parseWarnings } = jsmdParsed
  it('should have 4 cells and not trip up on caps or whitespace', () => {
    expect(cells.length).toEqual(4)
  })
  it('should have zero parse warnings', () => {
    expect(parseWarnings.length).toEqual(0)
  })
  it('all cells should have cellType==js', () => {
    expect(cells.map(c => c.cellType)).toEqual(expect.arrayContaining(['js']))
  })
})


// this case is for an observed bug
jsmdTestCase = `
%% js
`
describe('jsmd parser test case 4', () => {
  const jsmdParsed = parseJsmd(jsmdTestCase)
  const { cells } = jsmdParsed
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
%% js {"badcellsettingkey": "SCROLLABLE", "collapseEditViewInput":"COLLAPSED"}
foo
%% badcelltype {"collapseEditViewOutput":"COLLAPSED"}
foo
%% meta
invalid_json_content for meta setings
`
describe('jsmd parser test case 5', () => {
  const jsmdParsed = parseJsmd(jsmdTestCase)
  const { cells } = jsmdParsed
  const { parseWarnings } = jsmdParsed
  it('should have 4 cells', () => {
    expect(cells.length).toEqual(4)
  })
  it('should have four parse warnings', () => {
    expect(parseWarnings.length).toEqual(4)
  })
  it('all cells should have cellType==js (bad cellTypes should convert to js)', () => {
    expect(cells.map(c => c.cellType)).toEqual(['js', 'js', 'js', 'meta'])
  })
  it('cell 1 should have "collapseEditViewInput"=="COLLAPSED"', () => {
    expect(cells[1].settings.collapseEditViewInput).toEqual('COLLAPSED')
  })
  it('cell 2 should have "collapseEditViewOutput"=="COLLAPSED"', () => {
    expect(cells[2].settings.collapseEditViewOutput).toEqual('COLLAPSED')
  })
})


describe('jsmd stringifier test case 1', () => {
  const state = newNotebook()
  state.cells[0].content = 'foo'
  const jsmd = stringifyStateToJsmd(state, exportAt)
  const jsmdExpected = `%% meta
{
  "exportAt": "${exportAt}"
}

%% js
foo`
  it('simple state with default global setting should serialize to jsmd correctly', () => {
    expect(jsmd).toEqual(jsmdExpected)
  })
})

describe('jsmd stringifier test case 2', () => {
  const state = newNotebook()
  state.cells[0].content = 'foo'
  state.title = 'foo notebook'
  const jsmd = stringifyStateToJsmd(state, exportAt)
  const jsmdExpected = `%% meta
{
  "title": "foo notebook",
  "exportAt": "${exportAt}"
}

%% js
foo`
  it('simple state should serialize to jsmd correctly', () => {
    expect(jsmd).toEqual(jsmdExpected)
  })
})

describe('jsmd stringifier test case 3', () => {
  const state = newNotebook()
  state.title = 'foo notebook'
  state.viewMode = 'presentation'

  state.cells[0].content = 'foo'
  state.cells[0].collapseEditViewInput = 'COLLAPSED'

  state.cells.push(newCell(state.cells, 'markdown'))
  state.cells[1].content = 'foo'

  const jsmd = stringifyStateToJsmd(state, exportAt)
  const jsmdExpected = `%% meta
{
  "title": "foo notebook",
  "viewMode": "presentation",
  "exportAt": "${exportAt}"
}

%% js {"collapseEditViewInput":"COLLAPSED"}
foo

%% md
foo`
  it('cell settings should serialize to jsmd correctly', () => {
    expect(jsmd).toEqual(jsmdExpected)
  })
})

describe('jsmd stringifier test case 4', () => {
  const state = newNotebook()
  state.title = 'foo notebook'

  state.cells[0].content = 'foo'
  state.cells[0].collapseEditViewInput = 'COLLAPSED'

  const cellTypes = ['markdown', 'external dependencies', 'raw']
  cellTypes.forEach((cellType, i) => {
    state.cells.push(newCell(state.cells, cellType))
    state.cells[i + 1].content = 'foo'
  })

  const jsmd = stringifyStateToJsmd(state, exportAt)
  const jsmdExpected = `%% meta
{
  "title": "foo notebook",
  "exportAt": "${exportAt}"
}

%% js {"collapseEditViewInput":"COLLAPSED"}
foo

%% md
foo

%% resource
foo

%% raw
foo`
  it('all cell types should serialize to jsmd correctly', () => {
    expect(jsmd).toEqual(jsmdExpected)
  })
})
