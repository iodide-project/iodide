export function getConnectionMode(state) {
  if (!('connectionMode' in state.notebookInfo)) throw Error('state does not have connectionMode')
  return state.notebookInfo.connectionMode
}

export function connectionModeIsStandalone(state) {
  return getConnectionMode(state) === 'STANDALONE'
}

export function connectionModeIsServer(state) {
  return getConnectionMode(state) === 'SERVER'
}

export function getNotebookID(state) {
  if (!connectionModeIsServer(state)) return undefined
  if (!(('notebook_id') in state.notebookInfo) ||
    !Number.isSafeInteger(state.notebookInfo.notebook_id)) { throw Error('notebookInfo does not have notebook_id') }
  return state.notebookInfo.notebook_id
}
