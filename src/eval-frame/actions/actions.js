import MarkdownIt from 'markdown-it'
import MarkdownItKatex from 'markdown-it-katex'
import MarkdownItAnchor from 'markdown-it-anchor'

import {
  NONCODE_EVAL_TYPES,
} from '../../state-schemas/state-schema'

import {
  // evaluateLanguagePluginCell,
  evaluateLanguagePlugin,
  ensureLanguageAvailable,
  runCodeWithLanguage,
} from './language-actions'

import { evaluateFetchText } from './fetch-cell-eval-actions'
import { postMessageToEditor } from '../port-to-editor';

const MD = MarkdownIt({ html: true })
MD.use(MarkdownItKatex).use(MarkdownItAnchor)

const CodeMirror = require('codemirror') // eslint-disable-line

const initialVariables = new Set(Object.keys(window)) // gives all global variables
initialVariables.add('__core-js_shared__')
initialVariables.add('Mousetrap')
initialVariables.add('CodeMirror')
initialVariables.add('FETCH_RESOLVERS')

export function sendStatusResponseToEditor(status, evalId) {
  postMessageToEditor('EVALUATION_RESPONSE', { status, evalId })
}

function getUserDefinedVariablesFromWindow() {
  return Object.keys(window)
    .filter(g => !initialVariables.has(g))
}

function IdFactory() {
  this.state = 0
  this.nextId = () => {
    this.state += 1
    return this.state
  }
}

export const historyIdGen = new IdFactory()

class Singleton {
  constructor() {
    this.data = null
  }
  set(data) {
    this.data = data
  }
  get() {
    return this.data
  }
}

const MOST_RECENT_CHUNK_ID = new Singleton()

export { MOST_RECENT_CHUNK_ID }


// ////////////// actual actions

export const EVALUATION_RESULTS = {}

export function appendToEvalHistory(cellId, content, value, historyOptions = {}) {
  const historyId = historyOptions.historyId === undefined ?
    historyIdGen.nextId() : historyOptions.historyId
  const historyType = historyOptions.historyType === undefined ?
    'CELL_EVAL_VALUE' : historyOptions.historyType

  EVALUATION_RESULTS[historyId] = value

  // returned obj must match history schema
  return {
    type: 'APPEND_TO_EVAL_HISTORY',
    cellId,
    content,
    historyId,
    historyType,
    lastRan: Date.now(),
  }
}

export function updateValueInHistory(historyId, value) {
  EVALUATION_RESULTS[historyId] = value
  return {
    type: 'UPDATE_VALUE_IN_HISTORY',
    historyId,
  }
}

export function updateUserVariables() {
  return {
    type: 'UPDATE_USER_VARIABLES',
    userDefinedVarNames: getUserDefinedVariablesFromWindow(),
  }
}

export function updateConsoleText(consoleText) {
  return {
    type: 'UPDATE_CONSOLE_TEXT',
    consoleText,
  }
}

export function consoleHistoryStepBack(consoleCursorDelta) {
  return {
    type: 'CONSOLE_HISTORY_MOVE',
    consoleCursorDelta,
  }
}

export function evalConsoleInput(languageId) {
  return (dispatch, getState) => {
    const state = getState()
    const code = state.consoleText
    // exit if there is no code in the console to  eval
    if (!code) { return undefined }
    const evalLanguageId = languageId === undefined ? state.languageLastUsed : languageId
    const language = state.loadedLanguages[evalLanguageId]

    // FIXME: deal with side-effects for console evals
    // // clear stuff relating to the side effect target before evaling
    // dispatch({ type: 'CELL_SIDE_EFFECT_STATUS', cellId: cell.id, hasSideEffect: false })
    // // this is one place where we have to directly mutate the DOM b/c we need
    // // this to happen outside of React's update schedule. see also iodide-api/output.js
    // const sideEffectTarget = document.getElementById(`cell-${cell.id}-side-effect-target`)
    // if (sideEffectTarget) { sideEffectTarget.innerHTML = '' }


    const updateAfterEvaluation = (output) => {
      dispatch(updateConsoleText(''))
      dispatch({ type: 'CLEAR_CONSOLE_TEXT_CACHE' })
      dispatch(appendToEvalHistory(null, code, output))
      dispatch(updateUserVariables())
    }

    const messageCallback = (msg) => {
      dispatch(appendToEvalHistory(null, msg, undefined, { historyType: 'CELL_EVAL_INFO' }))
    }

    return runCodeWithLanguage(language, code, messageCallback)
      .then(updateAfterEvaluation)
      .catch((err) => {
        dispatch(appendToEvalHistory(null, code, err, { historyType: 'CONSOLE_EVAL' }))
        dispatch(updateConsoleText(''))
        dispatch({ type: 'CLEAR_CONSOLE_TEXT_CACHE' })
      })
  }
}

function evaluateCode(code, language, state, evalId) {
  return (dispatch) => {
    const updateCellAfterEvaluation = (output, evalStatus) => {
      const cellProperties = { rendered: true }
      if (evalStatus === 'ERROR') {
        cellProperties.evalStatus = evalStatus
        sendStatusResponseToEditor('ERROR', evalId)
      } else {
        sendStatusResponseToEditor('SUCCESS', evalId)
      }
      dispatch(appendToEvalHistory(null, code, output))
      dispatch(updateUserVariables())
    }

    const messageCallback = (msg) => {
      dispatch(appendToEvalHistory(null, msg, undefined, { historyType: 'CELL_EVAL_INFO' }))
    }

    return ensureLanguageAvailable(language, state, dispatch)
      .then(languageEvaluator => runCodeWithLanguage(languageEvaluator, code, messageCallback))
      .then(
        output => updateCellAfterEvaluation(output),
        output => updateCellAfterEvaluation(output, 'ERROR'),
      )
  }
}

// FIXME use evalFlags for something real
export function evaluateText(
  evalText,
  evalType,
  evalFlags, // eslint-disable-line
  chunkId = null,
  evalId,
) {
  // allowed types:
  // md
  return (dispatch, getState) => {
    // exit if there is no code to eval or no eval type
    // if (!evalText || !evalType) { return undefined }
    // FIXME: we need to deprecate side effects ASAP. They don't serve a purpose
    // in the direct jsmd editing paradigm.

    MOST_RECENT_CHUNK_ID.set(chunkId)
    const sideEffect = document.getElementById(`side-effect-target-${MOST_RECENT_CHUNK_ID.get()}`)
    if (sideEffect) {
      sideEffect.innerText = null
    }
    const state = getState()
    if (evalType === 'fetch') {
      return dispatch(evaluateFetchText(evalText, evalId))
    } else if (evalType === 'plugin') {
      return dispatch(evaluateLanguagePlugin(evalText, evalId))
    } else if (Object.keys(state.loadedLanguages).includes(evalType) ||
      Object.keys(state.languageDefinitions).includes(evalType)) {
      return dispatch(evaluateCode(evalText, evalType, state, evalId))
    } else if (NONCODE_EVAL_TYPES.includes(evalType) || evalType === '') {
      sendStatusResponseToEditor('SUCCESS', evalId)
    } else {
      sendStatusResponseToEditor('ERROR', evalId)
      return dispatch(appendToEvalHistory(
        null, evalText,
        new Error(`eval type ${evalType} is not defined`), {
          historyType: 'CONSOLE_EVAL',
        },
      ))
    }
    return Promise.resolve()
  }
}

export function saveEnvironment(updateObj, update) {
  return {
    type: 'SAVE_ENVIRONMENT',
    updateObj,
    update,
  }
}

export function changePaneHeight(heightShift) {
  return {
    type: 'CHANGE_PANE_HEIGHT',
    heightShift,
  }
}
