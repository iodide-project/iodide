/* global it describe expect */
import _ from 'lodash'

import { stringifyStateToJsmd, jsmdValidNotebookSettings } from '../jsmd-tools'
import { newNotebook, newCell } from '../../editor-state-prototypes'


// this can be defined once for all test cases
const lastExport = new Date().toISOString()

describe('jsmd stringifier test case 1', () => {
  const state = newNotebook()
  state.cells[0].content = 'foo'
  const jsmd = stringifyStateToJsmd(state, lastExport)
  const jsmdExpected = `%% meta
{
  "lastExport": "${lastExport}"
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
  const jsmd = stringifyStateToJsmd(state, lastExport)
  const jsmdExpected = `%% meta
{
  "title": "foo notebook",
  "lastExport": "${lastExport}"
}

%% js
foo`
  it('simple state should serialize to jsmd correctly', () => {
    expect(jsmd).toEqual(jsmdExpected)
  })
})


describe('jsmd stringifier test case 3, non-default cell settings 1', () => {
  const state = newNotebook()
  state.title = 'foo notebook'
  state.viewMode = 'REPORT_VIEW'

  state.cells[0].content = 'foo'
  state.cells.push(newCell(1, 'markdown'))
  state.cells[1].content = 'foo'

  const jsmd = stringifyStateToJsmd(state, lastExport)
  const jsmdExpected = `%% meta
{
  "title": "foo notebook",
  "viewMode": "REPORT_VIEW",
  "lastExport": "${lastExport}"
}

%% js
foo

%% md
foo`
  it('cell settings should serialize to jsmd correctly', () => {
    expect(jsmd).toEqual(jsmdExpected)
  })
})


describe('jsmd stringifier test case 4, non-default cell settings 2', () => {
  const state = newNotebook()
  state.title = 'foo notebook'

  state.cells[0].content = 'foo'
  _.set(state, 'cells[0].skipInRunAll', true)

  const cellTypes = ['markdown', 'raw']
  cellTypes.forEach((cellType, i) => {
    state.cells.push(newCell(i + 1, cellType))
    state.cells[i + 1].content = 'foo'
  })

  const jsmd = stringifyStateToJsmd(state, lastExport)
  const jsmdExpected = `%% meta
{
  "title": "foo notebook",
  "lastExport": "${lastExport}"
}

%% js {"skipInRunAll":true}
foo

%% md
foo

%% raw
foo`
  it('all cell types should serialize to jsmd correctly', () => {
    expect(jsmd).toEqual(jsmdExpected)
  })
})


describe('jsmd stringifier test case 5, non-default languages', () => {
  let state = newNotebook()
  beforeEach(() => {
    state = newNotebook()
    state.title = 'foo notebook'
  })

  it('non-js code cells should serialize to jsmd correctly', () => {
    _.set(state, 'cells[0].language', 'python')
    _.set(state, 'cells[0].content', 'foo')

    const jsmd = stringifyStateToJsmd(state, lastExport)
    const jsmdExpected = `%% meta
{
  "title": "foo notebook",
  "lastExport": "${lastExport}"
}

%% code {"language":"python"}
foo`
    expect(jsmd).toEqual(jsmdExpected)
  })
})


describe('jsmd stringifier: non-default meta setting jsmdValidNotebookSettings must serialize correctly', () => {
  const state = newNotebook()
  let metaToJsonify = {}
  const nonDefaultVal = '___this weird string is not default___'
  metaToJsonify = {}
  jsmdValidNotebookSettings.forEach((k) => {
    state[k] = nonDefaultVal
    metaToJsonify[k] = nonDefaultVal
  })
  state.lastExport = lastExport
  metaToJsonify.lastExport = lastExport

  it('all non-default meta setting must serialize correctly', () => {
    const expectedJson = JSON.stringify(metaToJsonify, undefined, 2)

    const jsmd = stringifyStateToJsmd(state, lastExport)
    const jsmdExpected = `%% meta
${expectedJson}

%% js`
    expect(jsmd).toEqual(jsmdExpected)
  })
})
