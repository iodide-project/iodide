import {
  mirroredStateProperties,
  mirroredCellProperties,
} from '../state-schemas/mirrored-state-schema'

import { newCellFromSchema } from '../state-schemas/state-prototype-from-schema'

const DEFAULT_EDITOR_WIDTH = Math.round(0.5 * document.documentElement.clientWidth)

export const editorOnlyCellProperties = {
  inputFolding: {
    type: 'string',
    enum: ['VISIBLE', 'SCROLL', 'HIDDEN'],
    default: 'VISIBLE',
  },
}

export const editorCellSchema = {
  type: 'object',
  properties:
    Object.assign({}, mirroredCellProperties, editorOnlyCellProperties),
  additionalProperties: false,
}

export const editorOnlyStateProperties = {
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
  evalFrameReady: {
    type: 'boolean',
    default: false,
  },
  helpModalOpen: {
    type: 'boolean',
    default: false,
  },
  lastSaved: {
    type: 'string',
    default: undefined,
  },
  lastExport: {
    type: 'string',
    default: undefined,
  },
  mode: {
    type: 'string',
    enum: ['COMMAND_MODE', 'EDIT_MODE', 'APP_MODE'],
    default: 'COMMAND_MODE',
  },
  title: {
    type: 'string',
    default: 'untitled',
  },
  userData: {
    // FIXME userData needs full schema!!
    type: 'object',
    default: {},
  },
  viewMode: {
    type: 'string',
    enum: ['EXPLORE_VIEW', 'REPORT_VIEW'],
    default: 'EXPLORE_VIEW',
  },
  notebookId: {
    type: 'integer',
    default: undefined,
  },
  wrapEditors: {
    type: 'boolean',
    default: false,
  },
}

export const editorStateSchema = {
  type: 'object',
  properties:
    Object.assign({}, mirroredStateProperties, editorOnlyStateProperties),
  additionalProperties: false,
}
