const DEFAULT_EDITOR_WIDTH = Math.round(0.5 * document.documentElement.clientWidth)
const DEFAULT_PANE_HEIGHT = Math.round(0.4 * document.documentElement.clientHeight)

function requireDisjointProperties(obj1, obj2, whitelist) {
  Object.keys(obj1).forEach((k1) => {
    if (k1 in obj2 && !whitelist.includes(k1)) {
      throw Error(`objects have shared property "${k1}"`)
    }
  })
}


// ETC SCHEMAS ===========================


const appMessageSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    details: { type: 'string' },
    when: { type: 'string' },
    id: { type: 'integer', minimum: 0 },
  },
  additionalProperties: false,
}

const languageSchema = {
  type: 'object',
  properties: {
    pluginType: { type: 'string', enum: ['language'] },
    languageId: { type: 'string' },
    displayName: { type: 'string' },
    codeMirrorMode: { type: 'string' },
    codeMirrorModeLoaded: { type: 'boolean' },
    keybinding: { type: 'string' },
    module: { type: 'string' },
    evaluator: { type: 'string' },
    url: { type: 'string' },
  },
  additionalProperties: false,
}


const jsLanguageDefinition = {
  pluginType: 'language',
  languageId: 'js',
  displayName: 'Javascript',
  codeMirrorMode: 'javascript',
  codeMirrorModeLoaded: true,
  module: 'window',
  evaluator: 'eval',
  keybinding: 'j',
  url: '',
}

// const pluginCellDefaultContent = `{
//   "pluginType": ""
//   "languageId": "",
//   "displayName": "",
//   "codeMirrorMode": "",
//   "keybinding": "",
//   "url": "",
//   "module": "",
//   "evaluator": ""
// }`


const environmentVariableSchema = {
  type: 'array',
  items: [
    { type: 'string', enum: ['object', 'string', 'rawString'] },
    { type: 'string' },
  ],
}


// CELL SCHEMAS ===========================


export const mirroredCellProperties = {
  cellType: {
    type: 'string',
    enum: ['code', 'markdown', 'raw', 'css', 'external dependencies', 'plugin'],
    default: 'code',
  },
  content: {
    type: 'string',
    default: '',
  },
  id: {
    type: 'integer',
    minimum: 0,
    default: 0,
  },
  language: {
    type: 'string',
    default: 'js',
  },
  selected: {
    type: 'boolean',
    default: false,
  },
  skipInRunAll: {
    type: 'boolean',
    default: false,
  },
}

const editorOnlyCellProperties = {
  inputFolding: {
    type: 'string',
    enum: ['VISIBLE', 'SCROLL', 'HIDDEN'],
    default: 'VISIBLE',
  },
}

const evalFrameOnlyCellProperties = {
  asyncProcessCount: {
    type: 'integer',
    minimum: 0,
    default: 0,
  },
  evalStatus: {
    type: 'string',
    enum: ['UNEVALUATED', 'PENDING', 'ASYNC_PENDING', 'SUCCESS', 'ERROR'],
    default: 'UNEVALUATED',
  },
  hasSideEffect: {
    type: 'boolean',
    default: false,
  },
  rendered: {
    type: 'boolean',
    default: false,
  },
  value: {
    default: undefined,
  }, // empty schema, `value` can be anything
}

requireDisjointProperties(mirroredCellProperties, editorOnlyCellProperties)
requireDisjointProperties(mirroredCellProperties, evalFrameOnlyCellProperties)
requireDisjointProperties(editorOnlyCellProperties, evalFrameOnlyCellProperties)

export const editorCellSchema = {
  type: 'object',
  properties:
    Object.assign({}, mirroredCellProperties, editorOnlyCellProperties),
  additionalProperties: false,
}

export const evalFrameCellSchema = {
  type: 'object',
  properties:
    Object.assign({}, mirroredCellProperties, evalFrameOnlyCellProperties),
  additionalProperties: false,
}

export function newCellFromSchema(schema, cellId, cellType = 'code', language = 'js') {
  const cell = {}
  Object.keys(schema.properties).forEach((k) => {
    cell[k] = schema.properties[k].default
  })
  cell.id = cellId
  cell.cellType = cellType
  cell.language = language
  return cell
}

export function newEvalFrameCell(cellId, cellType = 'code', language = 'js') {
  return newCellFromSchema(evalFrameCellSchema, cellId, cellType, language)
}


// ////////////////// OVERALL STATE


export const mirroredStateProperties = {
  appMessages: {
    type: 'array',
    items: appMessageSchema,
    default: [],
  },
  cells: {},
  executionNumber: {
    type: 'integer',
    minimum: 0,
    default: 0,
  },
  languages: {
    type: 'object',
    additionalProperties: languageSchema,
    default: { js: jsLanguageDefinition },
  },
  savedEnvironment: {
    type: 'object',
    additionalProperties: environmentVariableSchema,
    default: {},
  },
  scrollingLinked: {
    type: 'boolean',
    default: false,
  },
  sidePaneMode: {
    type: 'string',
    enum: ['_CLOSED', '_CONSOLE', 'DECLARED_VARIABLES', '_APP_INFO'],
    default: '_CONSOLE',
  },
  runningCellID: {
    type: 'integer',
    default: undefined,
  },
  viewMode: {},
}

const editorOnlyStateProperties = {
  autoSave: {
    type: 'string',
    default: undefined,
  },
  cells: {
    type: 'array',
    items: editorCellSchema,
    default: [newCellFromSchema(editorCellSchema, 0)],
  },
  editorWidth: {
    type: 'integer',
    default: DEFAULT_EDITOR_WIDTH,
  },
  evalFrameMessageQueue: {
    type: 'array',
    items: { type: 'object' },
    default: [],
  },
  languageLastUsed: {
    type: 'string',
    default: 'js',
  },
  lastSaved: {
    type: 'string',
    default: '_NEVER',
  },
  lastExport: {
    type: 'string',
    default: '_NEVER',
  },
  locallySaved: {
    type: 'array',
    items: { type: 'string' },
    default: [],
  },
  mode: {
    type: 'string',
    enum: ['COMMAND_MODE', 'EDIT_MODE', 'APP_MODE'],
    default: 'COMMAND_MODE',
  },
  viewMode: {
    type: 'string',
    enum: ['EXPLORE_VIEW', 'REPORT_VIEW'],
    default: 'EXPLORE_VIEW',
  },
  wrapEditors: {
    type: 'boolean',
    default: false,
  },
}


const evalFrameOnlyStateProperties = {
  cells: {
    type: 'array',
    items: evalFrameCellSchema,
    default: [newCellFromSchema(evalFrameCellSchema, 0)],
  },
  externalDependencies: {
    type: 'array',
    default: [],
  },
  history: {
    type: 'array',
    default: [],
  },
  paneHeight: {
    type: 'integer',
    default: DEFAULT_PANE_HEIGHT,
  },
  userDefinedVarNames: {
    type: 'array',
    items: { type: 'string' },
    default: [],
  },
  viewMode: {
    type: 'string',
    enum: ['EXPLORE_VIEW', 'REPORT_VIEW'],
    default: 'REPORT_VIEW',
  },
}


// note that 'cells' and 'viewMode' are defined in all 3 because:
// -these two do need to be mirrored; BUT
// -viewMode needs a different default in the two environments
// -cells uses different prototypes in the two environments
requireDisjointProperties(
  mirroredStateProperties,
  editorOnlyStateProperties,
  ['cells', 'viewMode'],
)
requireDisjointProperties(
  mirroredStateProperties,
  evalFrameOnlyStateProperties,
  ['cells', 'viewMode'],
)
requireDisjointProperties(
  editorOnlyStateProperties,
  evalFrameOnlyStateProperties,
  ['cells', 'viewMode'],
)

export const evalFrameStateSchema = {
  type: 'object',
  properties:
    Object.assign({}, mirroredStateProperties, evalFrameOnlyStateProperties),
  additionalProperties: false,
}

function newNotebookFromSchema(schema) {
  const initialState = {}
  Object.keys(schema.properties).forEach((k) => {
    initialState[k] = schema.properties[k].default
  })
  // push a new cell
  // initialState.cells.push()
  // set the cell that was just pushed to be the selected cell
  initialState.cells[0].selected = true
  // console.log(initialState)
  return initialState
}

export function newEvalFrameNotebook() {
  return newNotebookFromSchema(evalFrameStateSchema)
}

// function newCell(cellId, cellType = 'code', language = 'js') {
//   return {
//     asyncProcessCount: 0,
//     content: cellType === 'plugin' ? pluginCellDefaultContent : '',
//     id: cellId,
//     cellType,
//     value: undefined,
//     rendered: false,
//     selected: false,
//     evalStatus: 'UNEVALUATED',
//     hasSideEffect: false,
//     inputFolding: 'VISIBLE',
//     skipInRunAll: false,
//     language, // default language is js, but it only matters if the cell is a code cell
//   }
// }

// function newCellID(cells) {
//   return Math.max(-1, ...cells.map(c => c.id)) + 1
// }


// function newNotebook() {
//   const initialState = {
//     cells: [newCell(0)],
//     languages: { js: jsLanguageDefinition },
//     languageLastUsed: 'js',
//     userDefinedVarNames: [],
//     lastSaved: undefined,
//     mode: 'COMMAND_MODE',
//     viewMode: 'REPORT_VIEW',
//     sidePaneMode: '_CONSOLE',
//     paneHeight: 400,
//     history: [],
//     scrollingLinked: false,
//     externalDependencies: [],
//     executionNumber: 0,
//     appMessages: [],
//     autoSave: undefined,
//     locallySaved: [],
//     savedEnvironment: {},
//     runningCellID: undefined,
//   }
//   // set the cell that was just pushed to be the selected cell
//   initialState.cells[0].selected = true
//   return initialState
// }
