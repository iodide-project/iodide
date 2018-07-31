// This is a very simple enum-like class that will always return strings.
// Returning strings is required to keep things simple+serializable in the redux store.
// The only reason we wrap this in a little class it to expose the convenience
// `contains` and `values`

import {
  newEvalFrameCell,
  newEvalFrameNotebook,
  evalFrameStateSchema,
} from '../mirrored-state-prototypes'

// const StringEnum = class {
//   constructor(...vals) {
//     vals.forEach((v) => {
//       if (v === 'values' || v === 'contains') {
//         throw Error(`disallowed enum name: ${v}`)
//       }
//       this[v] = v
//     })
//     Object.freeze(this)
//   }
//   values() { return Object.keys(this) }
//   contains(key) { return Object.keys(this).indexOf(key) >= 0 }
// }

// export const cellTypeEnum = new StringEnum(
//   'code',
//   'markdown',
//   'raw',
//   'css',
//   'external dependencies',
//   'plugin',
// )

// export const cellEvalStatusEnum = new StringEnum(
//   'UNEVALUATED', 'PENDING', 'ASYNC_PENDING', 'SUCCESS', 'ERROR'
// )

// const cellSchema = {
//   type: 'object',
//   properties: {
//     asyncProcessCount: { type: 'integer', minimum: 0 },
//     content: { type: 'string' }, // change to string with default '' or 'untitled'
//     id: { type: 'integer', minimum: 0 },
//     cellType: {
//       type: 'string',
//       enum: cellTypeEnum.values(),
//     },
//     value: {}, // empty schema, `value` can be anything
//     rendered: { type: 'boolean' },
//     selected: { type: 'boolean' },
//     evalStatus: {
//       type: 'string',
//       enum: cellEvalStatusEnum.values(),
//     },
//     hasSideEffect: { type: 'boolean' },
//     inputFolding: { type: 'string', enum: ['VISIBLE', 'SCROLL', 'HIDDEN'] },
//     language: { type: 'string' }, // '' in case not a code cell
//     skipInRunAll: { type: 'boolean' },
//   },
//   additionalProperties: false,
// }

// const languageSchema = {
//   type: 'object',
//   properties: {
//     pluginType: { type: 'string', enum: ['language'] },
//     languageId: { type: 'string' },
//     displayName: { type: 'string' },
//     codeMirrorMode: { type: 'string' },
//     keybinding: { type: 'string' },
//     module: { type: 'string' },
//     evaluator: { type: 'string' },
//     url: { type: 'string' },
//   },
//   additionalProperties: false,
// }

// const environmentVariableSchema = {
//   type: 'array',
//   items: [
//     { type: 'string', enum: ['object', 'string', 'rawString'] },
//     { type: 'string' },
//   ],
// }

const stateSchema = evalFrameStateSchema
// {
//   type: 'object',
//   properties: {
//     scrollingLinked: { type: 'boolean' },
//     cells: {
//       type: 'array',
//       items: cellSchema,
//     },
//     languages: {
//       type: 'object',
//       additionalProperties: languageSchema,
//     },
//     languageLastUsed: { type: 'string' },
//     viewMode: {
//       type: 'string',
//       enum: ['EXPLORE_VIEW', 'REPORT_VIEW'],
//     },
//     history: {
//       type: 'array',
//     },
//     userDefinedVarNames: {
//       type: 'array',
//       items: { type: 'string' },
//     },
//     sidePaneMode: {
//       type: 'string',
//       enum: ['_CLOSED', '_CONSOLE', 'DECLARED_VARIABLES', '_APP_INFO'],
//     },
//     paneHeight: { type: 'integer' },
//     externalDependencies: { type: 'array' },
//     executionNumber: { type: 'integer', minimum: 0 },
//     appMessages: {
//       type: 'array',
//       items: { type: 'string' },
//     },
//     savedEnvironment: {
//       type: 'object',
//       additionalProperties: environmentVariableSchema,
//     },
//     runningCellID: { type: 'integer' },
//   },
//   additionalProperties: false,
// }

// const jsLanguageDefinition = {
//   pluginType: 'language',
//   languageId: 'js',
//   displayName: 'Javascript',
//   codeMirrorMode: 'javascript',
//   module: 'window',
//   evaluator: 'eval',
//   keybinding: 'j',
//   url: '',
// }

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

function newCell(cellId, cellType = 'code', language = 'js') {
  return newEvalFrameCell(cellId, cellType, language)
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

function newCellID(cells) {
  return Math.max(-1, ...cells.map(c => c.id)) + 1
}


function newNotebook() {
  return newEvalFrameNotebook()
  // const initialState = {
  //   cells: [newCell(0)],
  //   languages: { js: jsLanguageDefinition },
  //   // languageLastUsed: 'js',
  //   userDefinedVarNames: [],
  //   // lastSaved: undefined,
  //   // mode: 'COMMAND_MODE',
  //   viewMode: 'REPORT_VIEW',
  //   sidePaneMode: '_CONSOLE',
  //   paneHeight: 400,
  //   history: [],
  //   scrollingLinked: false,
  //   externalDependencies: [],
  //   executionNumber: 0,
  //   appMessages: [],
  //   // autoSave: undefined,
  //   // locallySaved: [],
  //   savedEnvironment: {},
  //   runningCellID: undefined,
  // }
  // // set the cell that was just pushed to be the selected cell
  // initialState.cells[0].selected = true
  // return initialState
}

export {
  newCell,
  newCellID,
  newNotebook,
  // enums and schemas
  stateSchema,
}
