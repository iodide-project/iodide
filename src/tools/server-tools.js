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
  const notebookID = state.notebookInfo.notebook_id
  if (!Number.isSafeInteger(notebookID) && notebookID !== undefined) throw Error('notebook_id must be undefined or an integer')
  return notebookID
}
