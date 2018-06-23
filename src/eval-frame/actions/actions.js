import MarkdownIt from 'markdown-it'
import MarkdownItKatex from 'markdown-it-katex'
import MarkdownItAnchor from 'markdown-it-anchor'

import {
  getCellById,
  // isCommandMode
} from '../tools/notebook-utils'
import {
  addExternalDependency,
  getSelectedCell,
} from '../reducers/cell-reducer-utils'

import { waitForExplicitContinuationStatusResolution } from '../iodide-api/evalQueue'
import { postActionToEditor } from '../port-to-editor'

// import { addLanguageKeybinding } from '../keybindings'

let evaluationQueue = Promise.resolve()

const MD = MarkdownIt({ html: true })
MD.use(MarkdownItKatex).use(MarkdownItAnchor)

const CodeMirror = require('codemirror') // eslint-disable-line

export function temporarilySaveRunningCellID(cellID) {
  return {
    type: 'TEMPORARILY_SAVE_RUNNING_CELL_ID',
    cellID,
  }
}


export function appendToEvalHistory(cellId, content) {
  return {
    type: 'APPEND_TO_EVAL_HISTORY',
    cellId,
    content,
  }
}

// note: this function is NOT EXPORTED. It is a private function meant
// to be wrapped by other actions that will configure and dispatch it.
export function updateCellProperties(cellId, updatedProperties) {
  return {
    type: 'UPDATE_CELL_PROPERTIES',
    cellId,
    updatedProperties,
  }
}

export function incrementExecutionNumber() {
  return {
    type: 'INCREMENT_EXECUTION_NUMBER',
  }
}
export function updateUserVariables() {
  return {
    type: 'UPDATE_USER_VARIABLES',
  }
}

function evaluateCodeCell(cell) {
  return (dispatch, getState) => {
    // this variable may get changed in eval.
    const state = getState()
    let output
    let evalStatus
    const code = cell.content
    const languageModule = state.languages[cell.language].module
    const { evaluator } = state.languages[cell.language]
    // this is one place where we have to directly mutate the DOM b/c we need
    // this to happen outside of React's update schedule. see also iodide-api/print.js
    document.getElementById(`cell-${cell.id}-side-effect-target`).innerHTML = ''
    dispatch(temporarilySaveRunningCellID(cell.id))
    try {
      output = window[languageModule][evaluator](code)
    } catch (e) {
      output = e
      evalStatus = 'ERROR'
    }
    const updateCellAfterEvaluation = () => {
      const cellProperties = { value: output, rendered: true }
      if (evalStatus === 'ERROR') cellProperties.evalStatus = evalStatus
      dispatch(updateCellProperties(cell.id, cellProperties))
      dispatch(incrementExecutionNumber())
      dispatch(appendToEvalHistory(cell.id, cell.content))
      dispatch(updateUserVariables())
    }

    const evaluation = Promise.resolve()
      .then(updateCellAfterEvaluation)
      .then(waitForExplicitContinuationStatusResolution)
      .then(() => dispatch(temporarilySaveRunningCellID(undefined)))
    return evaluation
  }
}

function evaluateMarkdownCell(cell) {
  return dispatch => dispatch(updateCellProperties(
    cell.id,
    {
      value: MD.render(cell.content),
      rendered: true,
      evalStatus: 'SUCCESS',
    },
  ))
}

function evaluateResourceCell(cell) {
  return (dispatch, getState) => {
    const externalDependencies = [...getState().externalDependencies]
    const dependencies = cell.content.split('\n').filter(d => d.trim().slice(0, 2) !== '//')
    const newValues = dependencies
      .filter(d => !externalDependencies.includes(d))
      .map(addExternalDependency)

    newValues.forEach((d) => {
      if (!externalDependencies.includes(d.src)) {
        externalDependencies.push(d.src)
      }
    })
    const evalStatus = newValues.map(d => d.status).includes('error') ? 'ERROR' : 'SUCCESS'
    dispatch(updateCellProperties(
      cell.id,
      {
        value: new Array(...[...cell.value || [], ...newValues]),
        rendered: true,
        evalStatus,
      },
    ))
    if (newValues.length) {
      dispatch(appendToEvalHistory(
        cell.id,
        `// added external dependencies:\n${newValues.map(s => `// ${s.src}`).join('\n')}`,
      ))
    }
    dispatch(incrementExecutionNumber())
    dispatch(updateUserVariables())
  }
}

function evaluateCSSCell(cell) {
  return (dispatch) => {
    dispatch(updateCellProperties(
      cell.id,
      {
        value: cell.content,
        rendered: true,
        evalStatus: 'SUCCESS',
      },
    ))
  }
}

// export function addLanguage(languageDefinition) {
//   return {
//     type: 'ADD_LANGUAGE',
//     languageDefinition,
//   }
// }

function evaluateLanguagePluginCell(cell) {
  return (dispatch) => {
    let pluginData
    let value
    let evalStatus
    let languagePluginPromise
    const rendered = true
    try {
      pluginData = JSON.parse(cell.content)
    } catch (err) {
      value = `plugin definition failed to parse:\n${err.message}`
      evalStatus = 'ERROR'
    }

    if (pluginData.url === undefined) {
      value = 'plugin definition missing "url"'
      evalStatus = 'ERROR'
      dispatch(updateCellProperties(cell.id, { value, evalStatus, rendered }))
    } else {
      const {
        url,
        // keybinding,
        // languageId,
        // codeMirrorMode,
        displayName,
      } = pluginData

      languagePluginPromise = new Promise((resolve, reject) => {
        const xhrObj = new XMLHttpRequest()

        xhrObj.addEventListener('progress', (evt) => {
          value = `downloading plugin: ${evt.loaded} bytes loaded`
          if (evt.total > 0) {
            value += `out of ${evt.total} (${evt.loaded / evt.total}%)`
          }
          evalStatus = 'ASYNC_PENDING'
          dispatch(updateCellProperties(cell.id, { value, evalStatus, rendered }))
        })

        xhrObj.addEventListener('load', () => {
          value = `${displayName} plugin downloaded, initializing`
          dispatch(updateCellProperties(cell.id, { value, evalStatus, rendered }))
          // see the following for asynchronous loading of scripts from strings:
          // https://developer.mozilla.org/en-US/docs/Games/Techniques/Async_scripts

          // Here, we wrap whatever the return value of the eval into a promise.
          // If it is simply evaling a code block, then it returns undefined.
          // But if it returns a Promise, then we can wait for that promise to resolve
          // before we continue execution.
          const pr = Promise.resolve(window
            .eval(xhrObj.responseText)) // eslint-disable-line no-eval

          pr.then(() => {
            value = `${displayName} plugin ready`
            evalStatus = 'SUCCESS'
            postActionToEditor({
              type: 'ADD_LANGUAGE',
              languageDefinition: pluginData,
            })
            // FIXME: need to pass keybinding info up to editor
            // if (keybinding.length === 1 && (typeof keybinding === 'string')) {
            // addLanguageKeybinding(
            //   [keybinding],
            //   () => dispatch(changeCellType('code', languageId)),
            // )
            // }
            dispatch(updateCellProperties(cell.id, { value, evalStatus, rendered }))
            resolve()
          })
        })

        xhrObj.addEventListener('error', () => {
          value = `${displayName} plugin failed to load`
          evalStatus = 'ERROR'
          dispatch(updateCellProperties(cell.id, { value, evalStatus, rendered }))
          reject()
        })

        xhrObj.open('GET', url, true)
        xhrObj.send()
        // FIXME this will need to send a message back to the editor scope somehow
        // in order to have the codemirror mode fetched/loaded whatevs in that scope
        // CodeMirror.requireMode(pluginData.codeMirrorMode, () => { })
      })
    }
    return languagePluginPromise
  }
}

export function evaluateCell(cellId) {
  return (dispatch, getState) => {
    let evaluation
    let cell
    if (cellId === undefined) {
      cell = getSelectedCell(getState())
    } else {
      cell = getCellById(getState().cells, cellId)
    }
    // here is where we should mark a cell as PENDING.
    if (cell.cellType === 'code') {
      evaluationQueue = evaluationQueue
        .then(() => dispatch(evaluateCodeCell(cell)))
      evaluation = evaluationQueue
    } else if (cell.cellType === 'markdown') {
      evaluation = dispatch(evaluateMarkdownCell(cell))
    } else if (cell.cellType === 'external dependencies') {
      evaluation = dispatch(evaluateResourceCell(cell))
    } else if (cell.cellType === 'css') {
      evaluation = dispatch(evaluateCSSCell(cell))
    } else if (cell.cellType === 'plugin') {
      if (JSON.parse(cell.content).pluginType === 'language') {
        evaluationQueue = evaluationQueue.then(() => dispatch(evaluateLanguagePluginCell(cell)))
        evaluation = evaluationQueue
      } else {
        // evaluation =
        // dispatch(updateAppMessages('No loader for plugin type or missing "pluginType" entry'))
      }
    } else {
      cell.rendered = false
    }
    return evaluation
  }
}

export function updateCellAndEval(cellState) {
  return (dispatch) => {
    dispatch(updateCellProperties(cellState.id, cellState))
    dispatch(evaluateCell(cellState.id))
  }
}

export function saveEnvironment(updateObj, update) {
  return {
    type: 'SAVE_ENVIRONMENT',
    updateObj,
    update,
  }
}

// eval-frame retains a copy of this to manage its own row collapse state, which
// the editor doesn't really need to care about
export function setCellRowCollapsedState(viewMode, rowType, rowOverflow, cellId) {
  return {
    type: 'SET_CELL_ROW_COLLAPSE_STATE',
    viewMode,
    rowType,
    rowOverflow,
    cellId,
  }
}

