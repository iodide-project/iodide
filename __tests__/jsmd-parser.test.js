import { parseJsmd,
  jsmdValidCellTypes,
  jsmdValidCellSettings } from './../src/jsmd-parser'

let jsmdEx1 = `%% meta
{"title": "What a web notebook looks like",
"viewMode": "editor",
"lastExport": "2017-12-13T17:46:16.207Z",
"jsmdVersionHash": "example_hash_1234567890",
"jsmdPreviousVersionHash": "example_hash_prev_1234567890",
"ailerusAppVersion": "0.0.1",
"ailerusAppLocation": "https://some.cdn.com/path/version/ailerusApp.js"
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
 
 %%
%%
%% dom
div#dom-cell-2
%% js   
// above this is a DOM cell, which we can also target
spinCubeInTarget("#dom-cell-2")`

let jsmdEx1Meta = {title: "What a web notebook looks like",
viewMode: "editor",
lastExport: "2017-12-13T17:46:16.207Z",
jsmdVersionHash: "example_hash_1234567890",
jsmdPreviousVersionHash: "example_hash_prev_1234567890",
ailerusAppVersion: "0.0.1",
ailerusAppLocation: "https://some.cdn.com/path/version/ailerusApp.js"
}

describe('jsmd parser Ex 1', ()=>{
  let jsmdParsed = parseJsmd(jsmdEx1)
  let cells = jsmdParsed.cells
  let parseWarnings = jsmdParsed.parseWarnings
  it('new cells should start with "\n%%" or "%%" at the start of the file. drop empty cells.', ()=> {
    expect(cells.length).toEqual(8)
  })
  it('should have correct cell types', ()=> {
    expect(cells.map(c => c.cellType)).toEqual(['meta','md','js','raw','md','resource','dom','js'])
  })
  it('should only have cell settings in the jsmdValidCellSettings list', ()=> {
    expect(cells.map(c => c.cellType)).toEqual(expect.arrayContaining(jsmdValidCellTypes))
  })
  it('should only have cell settings in the jsmdValidCellSettings list', ()=> {
    expect(cells.map(c => c.cellType)).toEqual(expect.arrayContaining(jsmdValidCellTypes))
  })
  it('should have zero parse warnings', ()=> {
    expect(parseWarnings.length).toEqual(0)
  })
  it('cell 1 should have settings {"collapseEditViewInput": "SCROLLABLE", "collapseEditViewOutput": "COLLAPSED"}', ()=> {
    expect(cells[1].settings).toEqual({collapseEditViewInput: 'SCROLLABLE', collapseEditViewOutput: 'COLLAPSED'})
  })
  it('should have correct meta settings', ()=> {
    expect(cells.filter(c=>c.cellType==="meta")[0].content).toEqual(jsmdEx1Meta)
  })
})


let jsmdEx2 = `

%% js
foo
%% JS       {"collapseEditViewInput": "SCROLLABLE"}
foo
%%Js
foo

%%    jS     {"collapseEditViewInput": "SCROLLABLE"}

foo

`

describe('jsmd parser Ex 2', ()=>{
  let jsmdParsed = parseJsmd(jsmdEx2)
  let cells = jsmdParsed.cells
  let parseWarnings = jsmdParsed.parseWarnings
  it('should have 5 cells and not trip up on caps or whitespace', ()=> {
    expect(cells.length).toEqual(5)
  })
})
