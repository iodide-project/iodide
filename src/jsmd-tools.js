import _ from 'lodash'
import { newNotebook } from './state-prototypes'
import htmlTemplate from './html-template'

const jsmdValidCellTypes = ['meta', 'md', 'js', 'raw', 'dom', 'resource']

const jsmdValidCellSettings = [
  'collapseEditViewInput',
  'collapseEditViewOutput',
  'collapsePresentationViewInput',
  'collapsePresentationViewOutput',
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
]

function stringifyStateToJsmd(state) {
  const defaultState = newNotebook()
  const defaultCell = defaultState.cells[0]
  // serialize cells. most of the work here is seeing if cell properties
  // are in the jsmd valid list, and seeing if they are non-default
  const cellsStr = state.cells.map((cell) => {
    const jsmdCellType = cellTypeToJsmdMap.get(cell.cellType)
    const cellSettings = {}
    for (const setting of jsmdValidCellSettings) {
      if (Object.prototype.hasOwnProperty.call(cell, setting)
        && cell[setting] !== defaultCell[setting]) {
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
    APP_PATH_STRING: '',
    CSS_PATH_STRING: '',
    APP_VERSION_STRING: IODIDE_VERSION,
    JSMD: '',
  })
}

export {
  parseJsmd,
  jsmdValidCellTypes,
  jsmdValidCellSettings,
  stringifyStateToJsmd,
  exportJsmdBundle,
}
