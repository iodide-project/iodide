/* global IODIDE_BUILD_TYPE */
import { newNotebook, newCell, newCellID } from '../editor-state-prototypes'
import {
  exportJsmdBundle,
  titleToHtmlFilename,
} from '../tools/jsmd-tools'
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

function getUserData() {
  return { userData: window.userData || {} }
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
    case 'NEW_NOTEBOOK':
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
      const notebookId = (IODIDE_BUILD_TYPE && IODIDE_BUILD_TYPE === 'server') ?
        parseInt(window.location.pathname.split('/').filter(s => s.length).pop(), 10) : undefined;

      return Object.assign(
        newNotebook(), nextState, { cells, notebookId },
        getUserData(),
      )
    }

    case 'NOTEBOOK_SAVED': {
      return Object.assign({}, state, { lastSaved: new Date().toISOString() })
    }

    case 'ADD_NOTEBOOK_ID': {
      return Object.assign({}, state, { notebookId: action.id })
    }

    case 'CHANGE_PAGE_TITLE':
      return Object.assign({}, state, { title: action.title })

    case 'SET_VIEW_MODE': {
      const { viewMode } = action
      return Object.assign({}, state, { viewMode })
    }

    case 'TOGGLE_HELP_MODAL': {
      const helpModalOpen = !state.helpModalOpen
      return Object.assign({}, state, { helpModalOpen })
    }

    case 'TOGGLE_EDITOR_LINK': {
      const scrollingLinked = !state.scrollingLinked
      return Object.assign({}, state, { scrollingLinked })
    }

    case 'CHANGE_MODE': {
      const { mode } = action
      return Object.assign({}, state, { mode })
    }

    case 'CHANGE_SIDE_PANE_MODE': {
      return Object.assign({}, state, { sidePaneMode: action.mode })
    }

    case 'CHANGE_SIDE_PANE_WIDTH': {
      const width = state.sidePaneWidth + action.widthShift
      return Object.assign({}, state, { sidePaneWidth: width })
    }

    case 'CHANGE_EDITOR_WIDTH': {
      const width = state.editorWidth + action.widthShift
      return Object.assign({}, state, { editorWidth: width })
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
      const languages = Object.assign(
        {},
        state.languages,
        { [languageDefinition.languageId]: languageDefinition },
      )
      return Object.assign({}, state, { languages })
    }

    case 'CODEMIRROR_MODE_READY': {
      const { codeMirrorMode } = action
      const languages = Object.assign({}, state.languages)
      // set all languages with correct codeMirrorMode to have codeMirrorModeLoaded===true
      Object.keys(languages).forEach((langKey) => {
        if (languages[langKey].codeMirrorMode === codeMirrorMode) {
          languages[langKey].codeMirrorModeLoaded = true
        }
      })
      return Object.assign({}, state, { languages })
    }

    default: {
      return state
    }
  }
}

export { getUserData }

export default notebookReducer
