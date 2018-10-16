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
