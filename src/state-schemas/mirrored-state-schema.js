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

export const jsLanguageDefinition = {
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

const environmentVariableSchema = {
  type: 'array',
  items: [
    { type: 'string', enum: ['object', 'string', 'rawString'] },
    { type: 'string' },
  ],
}


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
  copiedCells: {},
  cutCells: {},
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
  languageLastUsed: {
    type: 'string',
    default: 'js',
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
