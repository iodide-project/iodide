import { store } from '../store'
import { updateCellProperties } from '../actions/actions'
import { getCellById } from '../tools/notebook-utils'

export const getRunningCellID = () => store.getState().runningCellID

export const resetAsyncProcessCount = () => {
  const cellId = getRunningCellID()
  store.dispatch(updateCellProperties(cellId, {
    asyncProcessCount: 0,
  }))
}

export const incrementAsyncProcessCount = (n = 1) => {
  const cellId = getRunningCellID()
  const cell = getCellById(store.getState().cells, cellId)
  store.dispatch(updateCellProperties(cellId, {
    asyncProcessCount: cell.asyncProcessCount + n,
  }))
}

export const getRunningCellAsyncProcessStatus = () => {
  const cellId = getRunningCellID()
  const cell = getCellById(store.getState().cells, cellId)
  if (cell !== undefined) {
    return cell.asyncProcessCount
  }
  return undefined
}

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
  if (getRunningCellAsyncProcessStatus() > 0) {
    const interval = setInterval(() => {
      if (getRunningCellAsyncProcessStatus() === 0) {
        setRunningCellEvalStatus('SUCCESS')
        resolve()
        clearInterval(interval)
      }
    }, 50)
  } else {
    resolve()
  }
})

const awaitPromises = promises =>
  // is functionally identical to Promise.all.
  Promise.resolve()
    .then(() => {
      setRunningCellEvalStatus('ASYNC_PENDING')
      incrementAsyncProcessCount()
    })
    .then(() => Promise.all(promises).catch((err) => { throw Error(err) }))
    .then((resolutions) => {
      incrementAsyncProcessCount(-1)
      if (getRunningCellAsyncProcessStatus() === 0) {
        setRunningCellEvalStatus('SUCCESS')
      }
      return resolutions
    })

export const evalQueue = {
  requireExplicitContinuation: () => {
    setRunningCellEvalStatus('ASYNC_PENDING')
    incrementAsyncProcessCount(1)
  },
  continue: () => {
    if (getRunningCellAsyncProcessStatus() > 0) incrementAsyncProcessCount(-1)
  },
  await: awaitPromises,
}
