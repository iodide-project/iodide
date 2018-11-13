import {
  mirroredStateProperties,
  mirroredCellProperties,
} from '../state-schemas/mirrored-state-schema'

import { newCellFromSchema } from '../state-schemas/state-prototype-from-schema'

export const historySchema = {
  type: 'object',
  properties: {
    cellId: { type: ['integer', 'null'] },
    content: { type: 'string' },
    historyId: { type: 'integer' },
    historyType: {
      type: 'string',
      enum: [
        'CELL_EVAL_VALUE',
        'CELL_EVAL_INFO',
        'APP_INFO',
        'SAVED_REP',
        'CONSOLE_EVAL',
        'SNIPPET_EVAL',
        'FETCH_CELL_INFO',
      ],
    },
    lastRan: { type: 'integer' },
    value: {},
  },
  additionalProperties: false,
}

export const evalFrameOnlyCellProperties = {
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
    // empty schema because `value` can be anything
    default: undefined,
  },
}

export const evalFrameCellSchema = {
  type: 'object',
  properties:
    Object.assign({}, mirroredCellProperties, evalFrameOnlyCellProperties),
  additionalProperties: false,
}

export const evalFrameOnlyStateProperties = {
  cells: {
    type: 'array',
    items: evalFrameCellSchema,
    default: [newCellFromSchema(evalFrameCellSchema, 0)],
  },
  cellClipboard: {
    type: 'array',
    items: evalFrameCellSchema,
    default: [],
  },
  consoleText: {
    type: 'string',
    default: '',
  },
  consoleTextCache: {
    // stores the current entry when keying up/down
    type: 'string',
    default: '',
  },
  consoleScrollbackPosition: {
    // the position from the END of the history when keying up/down in the console
    type: 'integer',
    default: 0,
  },
  history: {
    type: 'array',
    items: historySchema,
    default: [],
  },
  reportChunks: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        cellContent: { type: 'string' },
        cellType: { type: 'string' },
        evalFlags: {
          type: 'array',
          items: { type: 'string' },
        },
        startLine: { type: 'integer' },
        endLine: { type: 'integer' },
      },
      additionalProperties: false,
      default: {},
    },
    default: [],
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

export const evalFrameStateSchema = {
  type: 'object',
  properties:
    Object.assign({}, mirroredStateProperties, evalFrameOnlyStateProperties),
  additionalProperties: false,
}
