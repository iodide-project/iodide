import { newNotebook, newCellID } from '../eval-frame-state-prototypes'
// import { getCellById } from '../../state-selectors'

function clearUserDefinedVars(userDefinedVarNames) {
  // remove user defined variables when loading/importing a new/saved NB
  userDefinedVarNames.forEach((varName) => {
    try {
      delete window[varName]
    } catch (e) {
      console.log(e)
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

const initialVariables = new Set(Object.keys(window)) // gives all global variables
initialVariables.add('__core-js_shared__')
initialVariables.add('Mousetrap')
initialVariables.add('CodeMirror')

const notebookReducer = (state = newNotebook(), action) => {
  let nextState
  // let title
  // let cells

  switch (action.type) {
    case 'NEW_NOTEBOOK':
      clearUserDefinedVars(state.userDefinedVarNames)
      return Object.assign(newNotebook())

    case 'UPDATE_EVAL_FRAME_FROM_INITIAL_JSMD': {
      // nextState = newNotebook()
      // Object.keys(nextState).forEach((k) => { nextState[k] = action.newState[k] })
      // return nextState
      return Object.assign(newNotebook(), action.stateUpdatesFromEditor)
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

    case 'CHANGE_SIDE_PANE_MODE': {
      return Object.assign({}, state, { sidePaneMode: action.mode })
    }

    case 'CHANGE_PANE_HEIGHT': {
      const paneHeight = state.paneHeight + action.heightShift
      return Object.assign({}, state, { paneHeight })
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
      // history.push(Object.assign({}, action))
      return Object.assign({}, state, { history })
    }

    case 'UPDATE_VALUE_IN_HISTORY': {
      const history = [...state.history]
      const historyEntry = history.find(h => h.historyId === action.historyId)
      if (historyEntry) { historyEntry.value = action.value }
      return Object.assign({}, state, { history })
    }

    case 'UPDATE_APP_MESSAGES': {
      nextState = Object.assign({}, state)
      nextState.appMessages = nextState.appMessages.slice()
      return addAppMessageToState(nextState, Object.assign({}, action.message))
    }

    case 'UPDATE_USER_VARIABLES': {
      const userDefinedVarNames = Object.keys(window)
        .filter(g => !initialVariables.has(g))
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
      // console.log('update?', action.update, 'obj:', newSavedEnvironment)
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
      const languages = Object.assign(
        {},
        state.languages,
        { [action.languageDefinition.languageId]: action.languageDefinition },
      )
      return Object.assign({}, state, { languages })
    }

    default: {
      return state
    }
  }
}

// export { getSavedNotebooks }

export default notebookReducer
