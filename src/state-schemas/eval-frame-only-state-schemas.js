import {
  mirroredStateProperties,
} from '../state-schemas/mirrored-state-schema'

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

export const evalFrameOnlyStateProperties = {
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
        chunkContent: { type: 'string' },
        chunkType: { type: 'string' },
        chunkId: { type: 'string' },
        evalFlags: {
          type: 'array',
          items: { type: 'string' },
        },
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
