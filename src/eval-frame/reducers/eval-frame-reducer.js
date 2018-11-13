import { newNotebook, newCell, newCellID } from '../eval-frame-state-prototypes'

function clearUserDefinedVars(userDefinedVarNames) {
  // remove user defined variables when loading/importing a new/saved NB
  userDefinedVarNames.forEach((varName) => {
    try {
      delete window[varName]
    } catch (e) {
      console.error(e)
    }
  })
}

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

const notebookReducer = (state = newNotebook(), action) => {
  let nextState
  switch (action.type) {
    case 'RESET_NOTEBOOK':
      clearUserDefinedVars(state.userDefinedVarNames)
      return Object.assign(newNotebook())

    case 'UPDATE_EVAL_FRAME_FROM_INITIAL_JSMD': {
      const cells = action.stateUpdatesFromEditor.cells
        .map(c => Object.assign(newCell(), c))
      const newState = Object.assign(
        newNotebook(),
        action.stateUpdatesFromEditor,
        { cells },
      )
      return newState
    }

    case 'CLEAR_VARIABLES': {
      clearUserDefinedVars(state.userDefinedVarNames)
      nextState = Object.assign({}, state)
      nextState.userDefinedVarNames = []
      nextState.externalDependencies = []
      return nextState
    }

    case 'SET_VIEW_MODE': {
      const { viewMode } = action
      return Object.assign({}, state, { viewMode })
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

    case 'APPEND_TO_EVAL_HISTORY': {
      const actionCopy = Object.assign({}, action)
      delete actionCopy.type
      const history = [...state.history, actionCopy]
      return Object.assign({}, state, { history })
    }

    case 'UPDATE_VALUE_IN_HISTORY': {
      const history = [...state.history]
      const historyEntry = history.find(h => h.historyId === action.historyId)
      if (historyEntry) { historyEntry.value = action.value }
      return Object.assign({}, state, { history })
    }

    case 'UPDATE_CONSOLE_TEXT': {
      return Object.assign({}, state, { consoleText: action.consoleText })
    }

    case 'CLEAR_CONSOLE_TEXT_CACHE': {
      return Object.assign({}, state, { consoleTextCache: '' })
    }

    case 'UPDATE_MARKDOWN_CHUNKS': {
      const { reportChunks } = action
      return Object.assign({}, state, { reportChunks })
    }

    case 'CONSOLE_HISTORY_MOVE': {
      const historyLength = state.history.length
      // note that we bound consoleScrollbackPosition between
      // zero (which represents the cursor being in th) and historyLength
      const nextScrollback = Math.min(Math.max(
        0,
        state.consoleScrollbackPosition + action.consoleCursorDelta,
      ), historyLength)


      let { consoleTextCache } = state
      if (state.consoleScrollbackPosition === 0) {
        // if we moved FROM 0, set the consoleTextCache from the current value
        consoleTextCache = state.consoleText
      }

      let nextConsoleText
      if (nextScrollback === 0) {
        // if we moved TO 0, set the consoleText from the cache
        nextConsoleText = consoleTextCache
      } else {
        // otherwise set the consoleText to the history value
        nextConsoleText = state.history[historyLength - nextScrollback].content
      }

      return Object.assign({}, state, {
        consoleText: nextConsoleText,
        consoleTextCache,
        consoleScrollbackPosition: nextScrollback,
      })
    }

    case 'UPDATE_APP_MESSAGES': {
      nextState = Object.assign({}, state)
      nextState.appMessages = nextState.appMessages.slice()
      return addAppMessageToState(nextState, Object.assign({}, action.message))
    }

    case 'UPDATE_USER_VARIABLES': {
      const { userDefinedVarNames } = action
      return Object.assign({}, state, { userDefinedVarNames })
    }

    case 'TEMPORARILY_SAVE_RUNNING_CELL_ID': {
      const { cellId } = action
      return Object.assign({}, state, { runningCellID: cellId })
    }

    case 'SAVE_ENVIRONMENT': {
      let newSavedEnvironment
      if (action.update) {
        newSavedEnvironment = Object
          .assign({}, state.savedEnvironment, action.updateObj)
      } else {
        newSavedEnvironment = action.updateObj
      }
      return Object.assign({}, state, { savedEnvironment: newSavedEnvironment })
    }

    case 'ENVIRONMENT_UPDATE_FROM_EDITOR': {
      return Object.assign({}, state, { savedEnvironment: action.savedEnvironment })
    }

    case 'TOGGLE_EDITOR_LINK': {
      const scrollingLinked = !state.scrollingLinked
      return Object.assign({}, state, { scrollingLinked })
    }

    case 'ADD_LANGUAGE_TO_EVAL_FRAME': {
      const loadedLanguages = Object.assign(
        {},
        state.loadedLanguages,
        { [action.languageDefinition.languageId]: action.languageDefinition },
      )
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

export default notebookReducer
