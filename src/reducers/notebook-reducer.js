import {
  newNotebook,
  getUserData,
  getNotebookInfo,
  newCell,
  newCellID,
} from '../editor-state-prototypes'

import {
  exportJsmdBundle,
  titleToHtmlFilename,
} from '../tools/jsmd-tools'
import {
  getNotebookID,
} from '../tools/server-tools'
import { postActionToEvalFrame } from '../port-to-eval-frame'

function newAppMessage(appMessageId, appMessageText, appMessageDetails, appMessageWhen) {
  return {
    id: appMessageId,
    message: appMessageText,
    details: appMessageDetails,
    when: appMessageWhen,
  }
}

function addAppMessageToState(state, appMessage) {
  const nextAppMessageId = newCellID(state.appMessages)
  state.appMessages
    .push(newAppMessage(nextAppMessageId, appMessage.message, appMessage.details, appMessage.when))
  return state
}

const initialVariables = new Set(Object.keys(window)) // gives all global variables
initialVariables.add('__core-js_shared__')
initialVariables.add('Mousetrap')
initialVariables.add('CodeMirror')

const notebookReducer = (state = newNotebook(), action) => {
  let nextState
  let title
  let cells

  switch (action.type) {
    case 'RESET_NOTEBOOK':
      return Object.assign(newNotebook(), getUserData())

    case 'EXPORT_NOTEBOOK': {
      const exportState = Object.assign(
        {},
        state,
        { viewMode: action.exportAsReport ? 'REPORT_VIEW' : 'EXPLORE_VIEW' },
      )
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(exportJsmdBundle(exportState))}`
      const dlAnchorElem = document.getElementById('export-anchor')
      dlAnchorElem.setAttribute('href', dataStr)
      title = exportState.title === undefined ? 'new-notebook' : exportState.title
      dlAnchorElem.setAttribute('download', titleToHtmlFilename(title))
      dlAnchorElem.click()

      return state
    }

    case 'TOGGLE_WRAP_IN_EDITORS':
      return Object.assign({}, state, { wrapEditors: !state.wrapEditors })

    case 'UPDATE_NOTEBOOK_INFO':
      return Object.assign({}, state, { notebookInfo: action.notebookInfo })

    case 'EVAL_FRAME_READY': {
      state.evalFrameMessageQueue.forEach((actionToPost) => {
        postActionToEvalFrame(actionToPost)
      })
      const { viewMode } = state
      // need to send viewMode since iframe defaults to viewMode='REPORT_VIEW'
      postActionToEvalFrame({ type: 'SET_VIEW_MODE', viewMode })
      return Object.assign({}, state, { evalFrameReady: true, evalFrameMessageQueue: [] })
    }

    case 'ADD_TO_EVAL_FRAME_MESSAGE_QUEUE': {
      console.log('ADD_TO_EVAL_FRAME_MESSAGE_QUEUE', action.actionToPost)
      const evalFrameMessageQueue = state.evalFrameMessageQueue.slice()
      evalFrameMessageQueue.push(action.actionToPost)
      return Object.assign({}, state, { evalFrameMessageQueue })
    }

    case 'IMPORT_NOTEBOOK': {
    // note: loading a NB should always assign to a copy of the latest global
    // and per-cell state for backwards compatibility
      nextState = action.newState
      cells = nextState.cells.map((cell, i) =>
        Object.assign(newCell(i, cell.cellType), cell))

      const notebookId = getNotebookID(nextState)
      const { notebookInfo } = nextState
      notebookInfo.notebook_id = notebookId
      return Object.assign(
        newNotebook(), nextState, { cells, notebookInfo },
        getUserData(), getNotebookInfo(),
      )
    }

    case 'NOTEBOOK_SAVED': {
      return Object.assign({}, state, {
        lastSaved: new Date().toISOString(),
        notebookInfo: Object.assign({}, state.notebookInfo, { user_can_save: true }),
      })
    }

    case 'ADD_NOTEBOOK_ID': {
      const notebookId = action.id
      const notebookInfo = Object.assign({}, state.notebookInfo)
      notebookInfo.notebook_id = notebookId
      return Object.assign({}, state, { notebookInfo })
    }

    case 'CHANGE_PAGE_TITLE':
      return Object.assign({}, state, { title: action.title })

    case 'SET_VIEW_MODE': {
      const { viewMode } = action
      return Object.assign({}, state, { viewMode })
    }

    case 'SET_MODAL_STATE': {
      return Object.assign({}, state, { modalState: action.modalState })
    }

    case 'TOGGLE_EDITOR_LINK': {
      const scrollingLinked = !state.scrollingLinked
      return Object.assign({}, state, { scrollingLinked })
    }

    case 'CHANGE_MODE': {
      const { mode } = action
      return Object.assign({}, state, { mode })
    }

    case 'INCREMENT_EXECUTION_NUMBER': {
      let { executionNumber } = state
      executionNumber += 1
      return Object.assign({}, state, { executionNumber })
    }

    case 'LOGIN_SUCCESS': {
      const { userData } = action
      return Object.assign({}, state, { userData })
    }

    case 'LOGOUT': {
      const userData = {}
      return Object.assign({}, state, { userData })
    }

    case 'APPEND_TO_EVAL_HISTORY': {
      const history = [...state.history]
      history.push({
        cellId: action.cellId,
        lastRan: Date.now(),
        content: action.content,
      })
      return Object.assign({}, state, { history })
    }

    case 'UPDATE_APP_MESSAGES': {
      nextState = Object.assign({}, state)
      nextState.appMessages = nextState.appMessages.slice()
      return addAppMessageToState(nextState, Object.assign({}, action.message))
    }

    case 'TEMPORARILY_SAVE_RUNNING_CELL_ID': {
      const { cellId } = action
      return Object.assign({}, state, { runningCellID: cellId })
    }

    case 'ENVIRONMENT_UPDATE_FROM_EVAL_FRAME': {
      let newSavedEnvironment
      if (action.update) {
        newSavedEnvironment = Object
          .assign({}, state.savedEnvironment, action.updateObj)
      } else {
        newSavedEnvironment = action.updateObj
      }
      return Object.assign({}, state, { savedEnvironment: newSavedEnvironment })
    }

    case 'ADD_LANGUAGE_TO_EDITOR': {
      const { languageDefinition } = action
      languageDefinition.codeMirrorModeLoaded = false
      const loadedLanguages = Object.assign(
        {},
        state.loadedLanguages,
        { [languageDefinition.languageId]: languageDefinition },
      )
      const languageDefinitions = Object.assign(
        {},
        state.languageDefinitions,
        { [languageDefinition.languageId]: languageDefinition },
      )
      return Object.assign({}, state, { loadedLanguages, languageDefinitions })
    }

    case 'CODEMIRROR_MODE_READY': {
      const { codeMirrorMode } = action
      const loadedLanguages = Object.assign({}, state.loadedLanguages)
      // set all languages with correct codeMirrorMode to have codeMirrorModeLoaded===true
      Object.keys(loadedLanguages).forEach((langKey) => {
        if (loadedLanguages[langKey].codeMirrorMode === codeMirrorMode) {
          loadedLanguages[langKey].codeMirrorModeLoaded = true
        }
      })
      return Object.assign({}, state, { loadedLanguages })
    }

    case 'UPDATE_PANE_POSITIONS': {
      return Object.assign({}, state, { panePositions: action.panePositions })
    }

    default: {
      return state
    }
  }
}

export { getUserData }

export default notebookReducer
