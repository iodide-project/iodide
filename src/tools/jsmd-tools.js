/* global IODIDE_JS_PATH IODIDE_CSS_PATH IODIDE_VERSION */
import deepEqual from 'deep-equal'
import _ from 'lodash'

import { newNotebook, blankState, newCell } from '../state-prototypes'
import htmlTemplate from '../html-template'

const jsmdValidCellTypes = ['md', 'js', 'code', 'raw', 'resource', 'css', 'plugin']


const jsmdToCellTypeMap = new Map([
  ['js', 'code'],
  ['code', 'code'],
  ['md', 'markdown'],
  ['plugin', 'plugin'],
  ['markdown', 'markdown'],
  ['external', 'external dependencies'],
  ['resource', 'external dependencies'],
  ['raw', 'raw'],
  ['css', 'css'],
])

const cellTypeToJsmdMap = new Map([
  ['plugin', 'plugin'],
  ['code', 'code'],
  ['markdown', 'md'],
  ['external dependencies', 'resource'],
  ['raw', 'raw'],
  ['css', 'css'],
])

const jsmdValidNotebookSettings = [
  'title',
  'viewMode',
  'lastSaved',
  'languages',
]
const jsmdValidCellSettingPaths = [
  'language',
  'rowSettings.REPORT.input',
  'rowSettings.REPORT.output',
  'skipInRunAll',
]

function getNonDefaultValuesForPaths(paths, target, template) {
  const out = {}
  paths.forEach((p) => {
    if (_.get(target, p) !== _.get(template, p)) {
      out[p] = _.get(target, p)
    }
  })
  return out
}

function parseMetaChunk(content, parseWarnings) {
  let metaSettings
  try {
    metaSettings = JSON.parse(content)
  } catch (e) {
    parseWarnings.push({
      parseError: 'Failed to parse notebook settings from meta cell. Using default settings.',
      details: content,
      jsError: `${e.name}: ${e.message}`,
    })
    metaSettings = {} // set content back to empty object
  }
  return { chunkType: 'meta', iodideSettings: metaSettings }
}

function parseCellChunk(chunkType, content, settings, str, chunkNum, parseWarnings) {
  let cellType = jsmdToCellTypeMap.get(chunkType)
  // if the cell type is not valid, set it to js
  if (jsmdValidCellTypes.indexOf(chunkType) === -1) {
    parseWarnings.push({
      parseError: 'invalid cell type, converted to js cell',
      details: `chunkType: ${chunkType} chunkNum:${chunkNum} raw string: ${str}`,
    })
    cellType = 'code'
  }

  const cell = newCell(chunkNum, cellType)
  cell.content = content
  // make sure that only valid cell settings are kept
  Object.keys(settings).forEach((path) => {
    if (_.includes(jsmdValidCellSettingPaths, path)) {
      _.set(cell, path, settings[path])
    } else {
      parseWarnings.push({
        parseError: 'invalid cell setting path',
        details: path,
      })
    }
  })

  return { chunkType: 'cell', cell }
}

function parseJsmdChunk(str, i, parseWarnings) {
  // note: this is not a pure function, it mutates parseWarnings
  let chunkType
  let settings = {}
  let content
  let firstLine
  const firstLineBreak = str.indexOf('\n')
  if (firstLineBreak === -1) {
    // a cell with only 1 line, and hence no content
    firstLine = str
    content = ''
  } else {
    firstLine = str.substring(0, firstLineBreak).trim()
    content = str.substring(firstLineBreak + 1).trim()
  }
  // let firstLine = str.substring(0,firstLineBreak).trim()
  const firstLineFirstSpace = firstLine.indexOf(' ')


  if (firstLineFirstSpace === -1) {
    // if there is NO space on the first line (after trimming), there are no cell settings
    chunkType = firstLine.toLowerCase()
  } else {
    // if there is a space on the first line (after trimming), there must be cell settings
    chunkType = firstLine.substring(0, firstLineFirstSpace).toLowerCase()
    // make sure the cell settings parse as JSON
    try {
      settings = JSON.parse(firstLine.substring(firstLineFirstSpace + 1))
    } catch (e) {
      parseWarnings.push({
        parseError: 'failed to parse cell settings, using defaults',
        details: firstLine,
        jsError: `${e.name}: ${e.message}`,
      })
    }
  }
  let chunkObject
  if (chunkType === 'meta') {
    chunkObject = parseMetaChunk(content, parseWarnings)
  } else {
    chunkObject = parseCellChunk(chunkType, content, settings, str, i, parseWarnings)
  }

  return chunkObject
}

function parseJsmd(jsmd) {
  const parseWarnings = []
  const chunkObjects = jsmd
    .split('\n%%')
    .map((str, chunkNum) => {
      // if this is the first chunk, and it starts with "%%", drop those chars
      let sstr
      if (chunkNum === 0 && str.substring(0, 2) === '%%') {
        sstr = str.substring(2)
      } else {
        sstr = str
      }
      return sstr
    })
    .map(str => str.trim())
    .filter(str => str !== '')
    .map((str, i) => parseJsmdChunk(str, i, parseWarnings))
  return { chunkObjects, parseWarnings }
}

function stateFromJsmd(jsmdString) {
  const parsed = parseJsmd(jsmdString)
  const { chunkObjects } = parsed
  const { parseWarnings } = parsed
  if (parseWarnings.length > 0) {
    console.warn('JSMD parse errors', parseWarnings)
  }
  // initialize a blank notebook
  const initialState = blankState()
  // add top-level meta settings if any exist
  const meta = chunkObjects.filter(c => c.chunkType === 'meta')[0]
  if (meta) {
    Object.assign(initialState, meta.iodideSettings)
  }

  chunkObjects
    .filter(c => c.chunkType !== 'meta')
    .forEach((c) => {
      initialState.cells.push(c.cell)
    })
  // if only a meta cell exists, return a default JS cell
  if (initialState.cells.length === 0) {
    initialState.cells.push(newCell(0, 'code'))
  }
  // set cell 0  to be the selected cell
  initialState.cells[0].selected = true
  return initialState
}


function stringifyStateToJsmd(state, exportDatetimeString) {
  // we pass in exportDatetimeString as a string to keep this function
  // **functional** -- makes testing easier
  const defaultState = newNotebook()
  // let defaultCellPrototype = defaultState.cells[0]
  // serialize cells. most of the work here is seeing if cell properties
  // are in the jsmd valid list, and seeing if they are not default
  // values for this cell type
  const cellsStr = state.cells.map((cell) => {
    const defaultCell = newCell(0, cell.cellType)
    const cellSettings = getNonDefaultValuesForPaths(
      jsmdValidCellSettingPaths,
      cell,
      defaultCell,
    )
    let cellSettingsStr = JSON.stringify(cellSettings)
    let jsmdCellType = cellTypeToJsmdMap.get(cell.cellType)
    // note: js is the DEFAULT language, so if the lang of this cell is JS,
    // cellSettings.language will be undefined since it matches that default
    jsmdCellType = jsmdCellType === 'code' && cellSettings.language === undefined ? 'js' : jsmdCellType
    cellSettingsStr = cellSettingsStr === '{}' ? '' : ` ${cellSettingsStr}`
    return `\n%% ${jsmdCellType}${cellSettingsStr}
${cell.content}`
  }).join('\n').trim()

  // serialize global settings. as above, check if state properties
  // are in the jsmd valid list, and check if they are non-default
  const metaSettings = {}
  for (const setting of jsmdValidNotebookSettings) {
    if (Object.prototype.hasOwnProperty.call(state, setting)
      && !deepEqual(state[setting], defaultState[setting])) {
      metaSettings[setting] = state[setting]
    }
  }
  metaSettings.lastExport = exportDatetimeString
  let metaSettingsStr = JSON.stringify(metaSettings, undefined, 2)
  metaSettingsStr = metaSettingsStr === '{}' ? '' : `%% meta\n${metaSettingsStr}\n\n`
  return metaSettingsStr + cellsStr
}

function exportJsmdBundle(state) {
  const htmlTemplateCompiler = _.template(htmlTemplate)
  return htmlTemplateCompiler({
    NOTEBOOK_TITLE: state.title,
    APP_PATH_STRING: IODIDE_JS_PATH,
    CSS_PATH_STRING: IODIDE_CSS_PATH,
    APP_VERSION_STRING: IODIDE_VERSION,
    JSMD: stringifyStateToJsmd(state, new Date().toISOString()),
  })
}

function titleToHtmlFilename(title) {
  return `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`
}

export {
  parseJsmd,
  stateFromJsmd,
  jsmdValidCellTypes,
  jsmdToCellTypeMap,
  jsmdValidCellSettingPaths,
  stringifyStateToJsmd,
  exportJsmdBundle,
  titleToHtmlFilename,
}
