import { languageDefinitions } from './language-definitions'

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

const environmentVariableSchema = {
  type: 'array',
  items: [
    { type: 'string', enum: ['object', 'string', 'rawString'] },
    { type: 'string' },
  ],
}

const panePositionSchema = {
  type: 'object',
  properties: {
    display: { type: 'string', enum: ['none', 'block'], default: 'none' },
    top: { type: 'number', default: 0 },
    left: { type: 'number', default: 0 },
    width: { type: 'number', default: 0 },
    height: { type: 'number', default: 0 },
  },
  additionalProperties: false,
}

const positionerDefaults = {
  display: 'none', top: 0, left: 0, width: 0, height: 0,
}

export const mirroredCellProperties = {
  cellType: {
    type: 'string',
    enum: ['code', 'markdown', 'raw', 'css', 'fetch', 'external dependencies', 'plugin'],
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
  highlighted: {
    type: 'boolean',
    default: false,
  },
  skipInRunAll: {
    type: 'boolean',
    default: false,
  },
}

// note that 'cells' and 'viewMode' are defined in all 3 of
// mirroredStateProperties, editorOnlyStateProperties, evalFrameOnlyStateProperties,
// because:
// -these two do need to be mirrored; BUT
// -viewMode needs a different default in the two environments
// -cells uses different prototypes in the two environments

export const mirroredStateProperties = {
  appMessages: {
    type: 'array',
    items: appMessageSchema,
    default: [],
  },
  cells: {},
  cellClipboard: {},
  executionNumber: {
    type: 'integer',
    minimum: 0,
    default: 0,
  },
  languageDefinitions: {
    type: 'object',
    additionalProperties: languageSchema,
    default: languageDefinitions,
  },
  loadedLanguages: {
    type: 'object',
    additionalProperties: languageSchema,
    default: { js: languageDefinitions.js },
  },
  languageLastUsed: {
    type: 'string',
    default: 'js',
  },
  panePositions: {
    type: 'object',
    additionalProperties: panePositionSchema,
    default: {
      EditorPositioner: Object.assign({}, positionerDefaults),
      ReportPositioner: Object.assign({}, positionerDefaults),
      ConsolePositioner: Object.assign({}, positionerDefaults),
      WorkspacePositioner: Object.assign({}, positionerDefaults),
      AppInfoPositioner: Object.assign({}, positionerDefaults),
    },
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
  runningCellID: {
    type: 'integer',
    default: undefined,
  },
  viewMode: {},
}
