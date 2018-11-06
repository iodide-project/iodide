import { connectionModeIsStandalone } from './server-tools'
import { exportJsmdToString } from './jsmd-tools'
import { setPreviousAutosave } from '../actions/actions'

function getAutosaveKey(state) {
  const documentId = connectionModeIsStandalone(state) ?
    `standalone-${window.location.pathname}` : state.notebookInfo.notebook_id
  return `autosave-${documentId}`
}

function getAutosaveState(state) {
  const autosaveKey = getAutosaveKey(state)
  return JSON.parse(localStorage.getItem(autosaveKey))
}

function getAutosaveJsmd(state) {
  const autosaveState = getAutosaveState(state)
  return autosaveState.dirtyCopy
}

function saveAutosaveState(autosaveKey, autosaveState) {
  localStorage.setItem(autosaveKey, JSON.stringify(autosaveState))
}

function checkForAutosave(store) {
  const state = store.getState()
  const autosaveState = getAutosaveState(state)
  if (autosaveState && autosaveState.dirtyCopy) {
    store.dispatch(setPreviousAutosave(true))
  }
}

function clearAutosave(state) {
  const autosaveKey = getAutosaveKey(state)
  localStorage.removeItem(autosaveKey)
}

function updateAutosave(state, original) {
  const autosaveKey = getAutosaveKey(state)
  const jsmd = exportJsmdToString(state, false)

  if (original) {
    // save (over) original, clear any existing dirty copy
    saveAutosaveState(autosaveKey, {
      originalCopy: jsmd,
      originalCopyRevision: state.notebookInfo.revision_id,
      originalSaved: new Date().toISOString(),
    })
  } else {
    const autosaveState = getAutosaveState(state)
    saveAutosaveState(autosaveKey, Object.assign(autosaveState, {
      dirtyCopy: jsmd,
      dirtySaved: new Date().toISOString(),
    }))
  }
}

let autoSaveTimeout

function subscribeToAutoSave(store) {
  store.subscribe(() => {
    // use a subscribe event so we don't pay the penalty of checking
    // for jsmd changes unless user is actively interacting with the ui
    // also, throttle save events to one per second
    if (!autoSaveTimeout) {
      autoSaveTimeout = setTimeout(() => {
        autoSaveTimeout = undefined;

        const state = store.getState()
        if (state.hasPreviousAutoSave) {
          return
        }

        const autosaveState = getAutosaveState(state)

        if (!autosaveState || !autosaveState.originalCopy) {
          // original document got lost somehow, save over it
          updateAutosave(state, true)
          return
        }

        const currentJsmd = exportJsmdToString(
          store.getState(),
          false,
        )
        if (currentJsmd !== autosaveState.dirtyCopy) {
          // dirty copy has been updated, save it
          updateAutosave(state, false)
        }
      }, 1000)
    }
  })
}

export {
  checkForAutosave,
  getAutosaveJsmd,
  getAutosaveState,
  clearAutosave,
  updateAutosave,
  subscribeToAutoSave,
}
