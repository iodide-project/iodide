/* global IODIDE_JS_PATH IODIDE_CSS_PATH IODIDE_VERSION */

import _ from 'lodash'
import { newNotebook, blankState, newCell } from './state-prototypes'
import htmlTemplate from './html-template'

const jsmdValidCellTypes = ['meta', 'md', 'js', 'raw', 'resource']

const jsmdValidCellSettings = [
  // 'collapseEditViewInput',
  // 'collapseEditViewOutput',
  // 'collapsePresentationViewInput',
  // 'collapsePresentationViewOutput',
]

const jsmdCellTypeMap = new Map([
  ['js', 'javascript'],
  ['javascript', 'javascript'],
  ['md', 'markdown'],
  ['markdown', 'markdown'],
  ['external', 'external dependencies'],
  ['resource', 'external dependencies'],
  ['dom', 'dom'],
  ['raw', 'raw'],
])

const cellTypeToJsmdMap = new Map([
  ['javascript', 'js'],
  ['markdown', 'md'],
  ['external dependencies', 'resource'],
  ['dom', 'dom'],
  ['raw', 'raw'],
])

const jsmdValidNotebookSettings = [
  'title',
  'viewMode',
  'lastSaved',
]

function parseCellString(str, i, parseWarnings) {
  // note: this is nota a pure function, it mutates parseWarnings
  let cellType
  let settings
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
    cellType = firstLine.toLowerCase()
  } else {
    // if there is a space on the first line (after trimming), there must be cell settings
    cellType = firstLine.substring(0, firstLineFirstSpace).toLowerCase()
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
  // if settings exist and parsed ok, make sure that only valid cell settings are kept
  if (settings) {
    const settingsOut = {}
    for (const key in settings) {
      if (jsmdValidCellSettings.indexOf(key) > -1) {
        settingsOut[key] = settings[key]
      } else {
        parseWarnings.push({
          parseError: 'invalid cell setting',
          details: key,
        })
      }
    }
    settings = settingsOut || undefined
  }
  // if the cell type is not valid, set it to js
  if (jsmdValidCellTypes.indexOf(cellType) === -1) {
    parseWarnings.push({
      parseError: 'invalid cell type, converted to js cell',
      details: `cellType: ${cellType} cellNum:${i} raw string: ${str}`,
    })
    cellType = 'js'
  }

  if (cellType === 'meta') {
    try {
      content = JSON.parse(content)
    } catch (e) {
      parseWarnings.push({
        parseError: 'Failed to parse notebook settings from meta cell. Using default settings.',
        details: content,
        jsError: `${e.name}: ${e.message}`,
      })
    }
  }
  return {
    cellType,
    settings,
    content,
  }
}

function parseJsmd(jsmd) {
  const parseWarnings = []
  const cells = jsmd
    .split('\n%%')
    .map((str, cellNum) => {
      // if this is the first cell, and it starts with "%%", drop those chars
      let sstr
      if (cellNum === 0 && str.substring(0, 2) === '%%') {
        sstr = str.substring(2)
      } else {
        sstr = str
      }
      return sstr
    })
    .map(str => str.trim())
    .filter(str => str !== '')
    .map((str, i) => parseCellString(str, i, parseWarnings))
  return { cells, parseWarnings }
}

function stateFromJsmd(jsmdString) {
  const parsed = parseJsmd(jsmdString)
  let { cells } = parsed
  const { parseWarnings } = parsed
  if (parseWarnings.length > 0) {
    console.warn('JSMD parse errors', parseWarnings)
  }
  // initialize a blank notebook
  const initialState = blankState()
  // add top-level meta settings if any exist
  const meta = cells.filter(c => c.cellType === 'meta')[0]
  if (meta) {
    Object.assign(initialState, meta.content)
  }

  cells = cells
    .filter(c => c.cellType !== 'meta')
    .forEach((c) => {
      const cell = Object.assign(
        newCell(initialState.cells, jsmdCellTypeMap.get(c.cellType)),
        c.settings,
        { content: c.content },
      )
      initialState.cells.push(cell)
    })
  // set cell 0  to be the selected cell
  initialState.cells[0].selected = true
  console.log(initialState)
  return initialState
}


function stringifyStateToJsmd(state) {
  const defaultState = newNotebook()
  let defaultCellPrototype = defaultState.cells[0]
  // serialize cells. most of the work here is seeing if cell properties
  // are in the jsmd valid list, and seeing if they are not default
  // values for this cell type
  const cellsStr = state.cells.map((cell) => {
    const jsmdCellType = cellTypeToJsmdMap.get(cell.cellType)
    defaultCellPrototype = newCell(defaultState.cells, cell.cellType)
    const cellSettings = {}
    for (const setting of jsmdValidCellSettings) {
      if (Object.prototype.hasOwnProperty.call(cell, setting)
        && cell[setting] !== defaultCellPrototype[setting]) {
        cellSettings[setting] = cell[setting]
      }
    }
    let cellSettingsStr = JSON.stringify(cellSettings)
    cellSettingsStr = cellSettingsStr === '{}' ? '' : ` ${cellSettingsStr}`
    return `\n%% ${jsmdCellType}${cellSettingsStr}
${cell.content}`
  }).join('\n').trim()

  // serialize global settings. as above, check if state properties
  // are in the jsmd valid list, and check if they are non-default
  const metaSettings = {}
  for (const setting of jsmdValidNotebookSettings) {
    if (Object.prototype.hasOwnProperty.call(state, setting)
      && state[setting] !== defaultState[setting]) {
      metaSettings[setting] = state[setting]
    }
  }
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
    JSMD: stringifyStateToJsmd(state),
  })
}

export {
  parseJsmd,
  stateFromJsmd,
  jsmdValidCellTypes,
  jsmdValidCellSettings,
  stringifyStateToJsmd,
  exportJsmdBundle,
}
