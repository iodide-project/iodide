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
    asyncEvaluator: { type: 'string' },
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


// note that 'viewMode' is defined in all 3 of
// mirroredStateProperties, editorOnlyStateProperties, evalFrameOnlyStateProperties,
// because:
// -these two do need to be mirrored; BUT
// -viewMode needs a different default in the two environments

export const mirroredStateProperties = {
  appMessages: {
    type: 'array',
    items: appMessageSchema,
    default: [],
  },
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
