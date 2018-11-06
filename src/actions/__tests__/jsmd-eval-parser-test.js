import { getEvalInfo } from '../jsmd-eval-parser'

const jsmdSample1 = `
blankblock
%% js
js block 1
foo

%%      fooblock     show hide render skip
fooblock contents

%%   md
### md block 1
%%

_md block 2_

%%fetch
fetch block 1`

describe('jsmdSample1 parses correct eval actions', () => {

  for (const cursorLine of [0, 1]) {
    it(`jsmdSample1, cursor line ${cursorLine}`, () => {
      expect(getEvalInfo(jsmdSample1, cursorLine))
        .toEqual({
          evalText: `
blankblock`,
          evalType: '',
          evalFlags: [],
        })
    })
  }


  for (const cursorLine of [2, 3, 4, 5]) {
    it(`jsmdSample1, cursor line ${cursorLine}`, () => {
      expect(getEvalInfo(jsmdSample1, cursorLine))
        .toEqual({
          evalText: `js block 1
foo
`,
          evalType: 'js',
          evalFlags: [],
        })
    })
  }


  for (const cursorLine of [6, 7, 8]) {
    it(`jsmdSample1, cursor line ${cursorLine}`, () => {
      expect(getEvalInfo(jsmdSample1, cursorLine))
        .toEqual({
          evalText: `fooblock contents
`,
          evalType: 'fooblock',
          evalFlags: ['show', 'hide', 'render', 'skip'],
        })
    })
  }


  for (const cursorLine of [9, 10]) {
    it(`jsmdSample1, cursor line ${cursorLine}`, () => {
      expect(getEvalInfo(jsmdSample1, cursorLine))
        .toEqual({
          evalText: '### md block 1',
          evalType: 'md',
          evalFlags: [],
        })
    })
  }


  for (const cursorLine of [11, 12, 13, 14]) {
    it(`jsmdSample1, cursor line ${cursorLine}`, () => {
      expect(getEvalInfo(jsmdSample1, cursorLine))
        .toEqual({
          evalText: `
_md block 2_
`,
          evalType: 'md',
          evalFlags: [],
        })
    })
  }


  for (const cursorLine of [15, 16, 17]) {
    it(`jsmdSample1, cursor line ${cursorLine}`, () => {
      expect(getEvalInfo(jsmdSample1, cursorLine))
        .toEqual({
          evalText: 'fetch block 1',
          evalType: 'fetch',
          evalFlags: [],
        })
    })
  }
})
