// This is a very simple enum-like class that will always return strings.
// Returning strings is required to keep things simple+serializable in the redux store.
// The only reason we wrap this in a little class it to expose the convenience
// `contains` and `values`

// for editorWidth calc. We're using this
// because re-resizable doesn't intelligently deal w/ calc(100% - 20px) or whatever.
const DEFAULT_EDITOR_WIDTH = Math.round(document.documentElement.clientWidth / 2)
// Math.max(
//   document.documentElement.clientWidth - 600,
//   (window.innerWidth - 600) || 0,
// )

const StringEnum = class {
  constructor(...vals) {
    vals.forEach((v) => {
      if (v === 'values' || v === 'contains') { throw Error(`disallowed enum name: ${v}`) }
      this[v] = v
    })
    Object.freeze(this)
  }
  values() { return Object.keys(this) }
  contains(key) { return Object.keys(this).indexOf(key) >= 0 }
}

const rowOverflowEnum = new StringEnum('VISIBLE', 'SCROLL', 'HIDDEN')

export const cellTypeEnum = new StringEnum(
  'code',
  'markdown',
  'raw',
  'css',
  'external dependencies',
  'plugin',
)

export const cellEvalStatusEnum = new StringEnum('UNEVALUATED', 'PENDING', 'ASYNC_PENDING', 'SUCCESS', 'ERROR')

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

const cellSchema = {
  type: 'object',
  properties: {
    asyncProcessCount: { type: 'integer', minimum: 0 },
    content: { type: 'string' }, // change to string with default '' or 'untitled'
    id: { type: 'integer', minimum: 0 },
    cellType: {
      type: 'string',
      enum: cellTypeEnum.values(),
    },
    value: {}, // empty schema, `value` can be anything
    rendered: { type: 'boolean' },
    selected: { type: 'boolean' },
    executionStatus: { type: 'string' },
    evalStatus: {
      type: 'string',
      enum: cellEvalStatusEnum.values(),
    },
    lastEvalTime: { type: 'integer', minimum: 0 },
    inputFolding: { type: 'string', enum: ['VISIBLE', 'SCROLL', 'HIDDEN'] },
    language: { type: 'string' }, // '' in case not a code cell
    skipInRunAll: { type: 'boolean' },
  },
  additionalProperties: false,
}
// cellSchema.required = Object.keys(cellSchema.properties)
// cellSchema.minProperties = Object.keys(cellSchema.properties).length

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

const environmentVariableSchema = {
  type: 'array',
  items: [
    { type: 'string', enum: ['object', 'string', 'rawString'] },
    { type: 'string' },
  ],
}

const stateSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    cells: {
      type: 'array',
      items: cellSchema,
    },
    languages: {
      type: 'object',
      additionalProperties: languageSchema,
    },
    languageLastUsed: { type: 'string' },
    mode: {
      type: 'string',
      enum: ['COMMAND_MODE', 'EDIT_MODE', 'APP_MODE'],
    },
    viewMode: {
      type: 'string',
      enum: ['EXPLORE_VIEW', 'REPORT_VIEW'],
    },
    history: {
      type: 'array',
    },
    userDefinedVarNames: {
      type: 'array',
      items: { type: 'string' },
    },
    lastSaved: {}, // FIXME change to string ONLY with default 'never'
    lastExport: {}, // FIXME change to string ONLY
    sidePaneMode: {}, // FIXME change to string ONLY
    sidePaneWidth: { type: 'integer' },
    editorWidth: { type: 'integer' },
    userData: { type: 'object' },
    evalFrameMessageQueue: {
      type: 'array',
      items: { type: 'object' },
    },
    evalFrameReady: { type: 'boolean' },
    externalDependencies: { type: 'array' },
    showFrame: { type: 'boolean' },
    showEditor: { type: 'boolean' },
    scrollingLinked: { type: 'boolean' },
    alwaysSelectInView: { type: 'boolean' },
    executionNumber: { type: 'integer', minimum: 0 },
    appMessages: {
      type: 'array',
      items: appMessageSchema,
    },
    autoSave: { type: 'string' },
    locallySaved: {
      type: 'array',
      items: { type: 'string' },
    },
    savedEnvironment: {
      type: 'object',
      additionalProperties: environmentVariableSchema,
    },
    runningCellID: { type: 'integer' },
    wrapEditors: { type: 'boolean' },
  },
  additionalProperties: false,
}
// stateSchema.required = Object.keys(stateSchema.properties)
// stateSchema.minProperties = Object.keys(stateSchema.properties).length

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

const pluginCellDefaultContent = `{
  "pluginType": ""
  "languageId": "",
  "displayName": "",
  "codeMirrorMode": "",
  "keybinding": "",
  "url": "",
  "module": "",
  "evaluator": ""
}`


function newCell(cellId, cellType = 'code', language = 'js') {
  return {
    asyncProcessCount: 0,
    content: cellType === 'plugin' ? pluginCellDefaultContent : '',
    id: cellId,
    cellType,
    value: undefined,
    rendered: false,
    selected: false,
    executionStatus: ' ',
    evalStatus: 'UNEVALUATED',
    lastEvalTime: 0,
    inputFolding: 'VISIBLE',
    skipInRunAll: false,
    language, // default language is js, but it only matters the cell is a code cell
  }
}

function newCellID(cells) {
  return Math.max(-1, ...cells.map(c => c.id)) + 1
}

function newNotebook() {
  const initialState = {
    title: 'untitled',
    cells: [newCell(0)],
    languages: { js: jsLanguageDefinition },
    languageLastUsed: 'js',
    userDefinedVarNames: [],
    lastSaved: undefined,
    userData: {},
    mode: 'COMMAND_MODE', // command, edit
    viewMode: 'EXPLORE_VIEW', // editor, presentation
    sidePaneMode: '_CONSOLE',
    sidePaneWidth: 562,
    history: [],
    showFrame: true,
    showEditor: true,
    scrollingLinked: false,
    alwaysSelectInView: false,
    evalFrameMessageQueue: [],
    evalFrameReady: false,
    externalDependencies: [],
    executionNumber: 0,
    appMessages: [],
    autoSave: undefined,
    locallySaved: [],
    savedEnvironment: {},
    runningCellID: undefined,
    editorWidth: DEFAULT_EDITOR_WIDTH,
    wrapEditors: false,
  }
  // set the cell that was just pushed to be the selected cell
  initialState.cells[0].selected = true
  return initialState
}

export {
  newCell,
  newCellID,
  newNotebook,
  // enums and schemas
  rowOverflowEnum,
  stateSchema,
}
