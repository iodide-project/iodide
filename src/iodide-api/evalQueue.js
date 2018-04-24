import { store } from '../store'
import { updateCellProperties } from '../actions/actions'
import { getCellById } from '../tools/notebook-utils'

export const getRunningCellID = () => store.getState().runningCellID

export const getRunningCellEvalStatus = () => {
  const cellId = getRunningCellID()
  const cell = getCellById(store.getState().cells, cellId)
  if (cell !== undefined) {
    return cell.evalStatus
  }
  return undefined
}

export const setRunningCellEvalStatus = (evalStatus) => {
  if (evalStatus === undefined) throw new Error('status must be defined')
  const cellId = getRunningCellID()
  store.dispatch(updateCellProperties(cellId, {
    evalStatus,
  }))
}

export const waitForExplicitContinuationStatusResolution = () => new Promise((resolve) => {
  if (getRunningCellEvalStatus() === 'ASYNC_PENDING') {
    const interval = setInterval(() => {
      if (getRunningCellEvalStatus() === 'SUCCESS') {
        resolve()
        clearInterval(interval)
      }
    }, 50)
  } else {
    resolve()
  }
})

export const evalQueue = {
  requireExplicitContinuation: () => { setRunningCellEvalStatus('ASYNC_PENDING') },
  continue: () => { setRunningCellEvalStatus('SUCCESS') },
}
