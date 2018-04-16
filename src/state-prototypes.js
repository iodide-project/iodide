// This is a very simple enum-like class that will always return strings.
// Returning strings is required to keep things simple+serializable in the redux store.
// The only reason we wrap this in a little class it to expose the convenience
// `contains` and `values`
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
// const rowTypeEnum = new StringEnum('input', 'output')
export const cellTypeEnum = new StringEnum(
  'code',
  'markdown',
  'raw',
  'css',
  'external dependencies',
  'plugin',
)
// const appViewEnum = new StringEnum('EXPLORE', 'REPORT') //was: 'editor', 'presentation'
// const appModeEnum = new StringEnum('COMMAND', 'EDIT', 'TITLE', 'MENU')


const cellSchema = {
  type: 'object',
  properties: {
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
    evalStatus: {}, // FIXME change to string ONLY
    rowSettings: { type: 'object' },
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
    keybinding: { type: 'string' },
    module: { type: 'string' },
    evaluator: { type: 'string' },
    url: { type: 'string' },
  },
  additionalProperties: false,
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
      enum: ['command', 'edit', 'title-edit'],
    },
    viewMode: {
      type: 'string',
      enum: ['editor', 'presentation'],
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
    externalDependencies: { type: 'array' },
    executionNumber: { type: 'integer', minimum: 0 },
    appMessages: {
      type: 'array',
      items: { type: 'string' },
    },
    autoSave: { type: 'string' },
    locallySaved: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  additionalProperties: false,
}
// stateSchema.required = Object.keys(stateSchema.properties)
// stateSchema.minProperties = Object.keys(stateSchema.properties).length


function nextOverflow(currentOverflow) {
  return { HIDDEN: 'VISIBLE', VISIBLE: 'SCROLL', SCROLL: 'HIDDEN' }[currentOverflow]
}

function newCellRowSettings(cellType) {
  switch (cellType) {
    case 'code':
      return {
        EXPLORE: { input: 'VISIBLE', sideeffect: 'VISIBLE', output: 'VISIBLE' },
        REPORT: { input: 'HIDDEN', sideeffect: 'HIDDEN', output: 'HIDDEN' },
      }
    case 'markdown':
      return {
        EXPLORE: { input: 'VISIBLE', output: 'VISIBLE' },
        REPORT: { input: 'VISIBLE', output: 'VISIBLE' },
      }
    case 'external dependencies':
      return {
        EXPLORE: { input: 'VISIBLE', output: 'VISIBLE' },
        REPORT: { input: 'HIDDEN', output: 'HIDDEN' },
      }
    case 'plugin':
      return {
        EXPLORE: { input: 'VISIBLE', output: 'VISIBLE' },
        REPORT: { input: 'HIDDEN', output: 'HIDDEN' },
      }
    case 'css':
      return {
        EXPLORE: { input: 'VISIBLE' },
        REPORT: { input: 'HIDDEN' },
      }
    case 'raw':
      return {
        EXPLORE: { input: 'VISIBLE' },
        REPORT: { input: 'HIDDEN' },
      }
    default:
      throw Error(`Unsupported cellType: ${cellType}`)
  }
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

function newCell(cellId, cellType, language = 'js') {
  return {
    content: cellType === 'plugin' ? pluginCellDefaultContent : '',
    id: cellId,
    cellType,
    value: undefined,
    rendered: false,
    selected: false,
    executionStatus: ' ',
    evalStatus: undefined,
    rowSettings: newCellRowSettings(cellType),
    skipInRunAll: false,
    language, // default language is js, but it only matters the cell is a code cell
  }
}

const jsLanguageDefinition = {
  pluginType: 'language',
  languageId: 'js',
  displayName: 'Javascript',
  codeMirrorMode: 'javascript',
  module: 'window',
  evaluator: 'eval',
  keybinding: 'j',
  url: '',
}

function blankState() {
  const initialState = {
    title: 'untitled',
    cells: [],
    languages: { js: jsLanguageDefinition },
    languageLastUsed: 'js',
    userDefinedVarNames: [],
    lastSaved: undefined,
    mode: 'command', // command, edit
    viewMode: 'editor', // editor, presentation
    sidePaneMode: undefined,
    history: [],
    externalDependencies: [],
    executionNumber: 0,
    appMessages: [],
    autoSave: undefined,
    locallySaved: [],
  }
  return initialState
}

function newCellID(cells) {
  return Math.max(-1, ...cells.map(c => c.id)) + 1
}

function addNewCellToState(state, cellType = 'code', language = 'js') {
  const nextCellId = newCellID(state.cells)
  state.cells.push(newCell(nextCellId, cellType, language))
  return state
}

function newNotebook() {
  // initialize a blank notebook and push a blank new cell into it
  const initialState = addNewCellToState(blankState())
  // set the cell that was just pushed to be the selected cell
  initialState.cells[0].selected = true
  return Object.assign(initialState)
}

export {
  newCell,
  newCellID,
  newNotebook,
  blankState,
  nextOverflow,
  addNewCellToState,
  // enums and schemas
  rowOverflowEnum,
  stateSchema,
}
