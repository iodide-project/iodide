import {
  mirroredStateProperties,
  mirroredCellProperties,
} from '../state-schemas/mirrored-state-schema'

import { newCellFromSchema } from '../state-schemas/state-prototype-from-schema'

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
  cellClipboard: {
    type: 'array',
    items: editorCellSchema,
    default: [],
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
  jsmd: {
    type: 'string',
    default: '',
  },
  jsmdChunks: {
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
  modalState: {
    type: 'string',
    enum: ['HELP_MODAL', 'MODALS_CLOSED'],
    default: 'MODALS_CLOSED',
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
    type: 'object',
    properties: {
      name: { type: 'string' },
      avatar: { type: 'string' },
    },
    additionalProperties: false,
    default: {},
  },
  notebookInfo: {
    type: 'object',
    properties: {
      user_can_save: { type: 'boolean' },
      notebook_id: { type: 'integer' },
      connectionMode: {
        type: 'string',
        enum: ['SERVER', 'STANDALONE'],
      },
    },
    default: {
      notebook_id: undefined,
      user_can_save: false,
      connectionMode: 'STANDALONE',
    },
  },
  hasPreviousAutoSave: {
    type: 'boolean',
    default: false,
  },
  viewMode: {
    type: 'string',
    enum: ['EXPLORE_VIEW', 'REPORT_VIEW'],
    default: 'EXPLORE_VIEW',
  },
  wrapEditors: {
    type: 'boolean',
    default: true,
  },
}

export const editorStateSchema = {
  type: 'object',
  properties:
    Object.assign({}, mirroredStateProperties, editorOnlyStateProperties),
  additionalProperties: false,
}
