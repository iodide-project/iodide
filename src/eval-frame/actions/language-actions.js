import { postMessageToEditor } from '../port-to-editor'
import {
  appendToEvalHistory,
  historyIdGen,
  updateCellProperties,
  updateValueInHistory,
} from './actions'

export function addLanguage(languageDefinition) {
  return {
    type: 'ADD_LANGUAGE_TO_EVAL_FRAME',
    languageDefinition,
  }
}

function loadLanguagePlugin(pluginData, historyId, cell, dispatch) {
  let value
  let evalStatus
  let languagePluginPromise
  const rendered = true

  if (pluginData.url === undefined) {
    value = 'plugin definition missing "url"'
    evalStatus = 'ERROR'
    dispatch(updateCellProperties(cell.id, { evalStatus, rendered }))
    dispatch(updateValueInHistory(historyId, value))
  } else {
    const {
      url,
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
        dispatch(updateCellProperties(cell.id, { evalStatus, rendered }))
        dispatch(updateValueInHistory(historyId, value))
      })

      xhrObj.addEventListener('load', () => {
        value = `${displayName} plugin downloaded, initializing`
        dispatch(updateCellProperties(cell.id, { evalStatus, rendered }))
        dispatch(updateValueInHistory(historyId, value))
        // see the following for asynchronous loading of scripts from strings:
        // https://developer.mozilla.org/en-US/docs/Games/Techniques/Async_scripts

        window.languagePluginUrl = url

        // Here, we wrap whatever the return value of the eval into a promise.
        // If it is simply evaling a code block, then it returns undefined.
        // But if it returns a Promise, then we can wait for that promise to resolve
        // before we continue execution.
        const pr = Promise.resolve(window
          .eval(xhrObj.responseText)) // eslint-disable-line no-eval

        pr.then(() => {
          value = `${displayName} plugin ready`
          evalStatus = 'SUCCESS'
          dispatch(addLanguage(pluginData))
          postMessageToEditor('POST_LANGUAGE_DEF_TO_EDITOR', pluginData)
          dispatch(updateCellProperties(cell.id, { evalStatus, rendered }))
          dispatch(updateValueInHistory(historyId, value))
          delete window.languagePluginUrl
          resolve()
        })
      })

      xhrObj.addEventListener('error', () => {
        value = `${displayName} plugin failed to load`
        evalStatus = 'ERROR'
        dispatch(updateCellProperties(cell.id, { evalStatus, rendered }))
        dispatch(updateValueInHistory(historyId, value))
        reject()
      })

      xhrObj.open('GET', url, true)
      xhrObj.send()
    })
  }
  return languagePluginPromise
}

export function evaluateLanguagePluginCell(cell) {
  return (dispatch) => {
    const historyId = historyIdGen.nextId()
    dispatch(appendToEvalHistory(
      cell.id,
      cell.content,
      undefined,
      { historyId, historyType: 'CELL_EVAL_INFO' },
    ))

    let pluginData
    try {
      pluginData = JSON.parse(cell.content)
    } catch (err) {
      dispatch(updateCellProperties(cell.id, { evalStatus: 'ERROR', rendered: true }))
      dispatch(updateValueInHistory(historyId, `plugin definition failed to parse:\n${err.message}`))
      return Promise.reject()
    }

    return loadLanguagePlugin(pluginData, historyId, cell, dispatch)
  }
}

export function ensureLanguageAvailable(languageId, cell, state, dispatch) {
  if (Object.prototype.hasOwnProperty.call(state.loadedLanguages, languageId)) {
    return new Promise(resolve => resolve(state.loadedLanguages[languageId]))
  }
  if (Object.prototype.hasOwnProperty.call(state.languageDefinitions, languageId)) {
    const historyId = historyIdGen.nextId()
    dispatch(appendToEvalHistory(
      cell.id,
      `Loading ${state.languageDefinitions[languageId].displayName} language plugin`,
      undefined,
      { historyId, historyType: 'CELL_EVAL_INFO' },
    ))

    return loadLanguagePlugin(
      state.languageDefinitions[languageId],
      historyId,
      cell,
      dispatch,
    ).then(() => state.languageDefinitions[languageId])
  }
  // There is neither a loaded language or a predefined definition that matches...
  // FIXME: It would be hard to get here in the UX, but with direct JSMD
  // editing you could...
  return new Promise((resolve, reject) => reject())
}

export function runCodeWithLanguage(language, code, messageCallback) {
  const { module, evaluator, asyncEvaluator } = language

  if (asyncEvaluator !== undefined) {
    const messageCb = (messageCallback === undefined) ? () => {} : messageCallback
    return window[module][asyncEvaluator](code, messageCb)
  }
  return new Promise((resolve, reject) => {
    try {
      resolve(window[module][evaluator](code))
    } catch (e) {
      reject(e)
    }
  })
}
