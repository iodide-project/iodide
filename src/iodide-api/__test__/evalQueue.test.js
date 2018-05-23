import {
  getRunningCellID,
  getRunningCellEvalStatus,
  setRunningCellEvalStatus,
  waitForExplicitContinuationStatusResolution,
  evalQueue,
} from '../evalQueue'
import { store } from '../../store'
import { temporarilySaveRunningCellID, newNotebook } from '../../actions/actions'

jest.useFakeTimers()

describe('getRunningCellID', () => {
  beforeEach(() => {
    store.dispatch(newNotebook())
    store.dispatch(temporarilySaveRunningCellID(0))
  })
  it('properly retrieves the running cell ID', () => {
    const id = getRunningCellID()
    expect(id).toBe(0)
  })
})

describe('flow API', () => {
  beforeEach(() => {
    store.dispatch(newNotebook())
    store.dispatch(temporarilySaveRunningCellID(0))
  })

  const runningEvalStatus = () => store.getState().cells[0].evalStatus
  it('allows for explicit setting of cell continuation', () => {
    evalQueue.requireExplicitContinuation()
    expect(runningEvalStatus()).toBe('ASYNC_PENDING')
    evalQueue.continue()
    expect(runningEvalStatus()).toBe('SUCCESS')
  })
  it('accepts only valid setExplicitContinuationStatus arguments', () => {
    expect(() => setRunningCellEvalStatus('whatever')).toThrow()
    expect(() => setRunningCellEvalStatus()).toThrow()
    expect(() => setRunningCellEvalStatus(1000)).toThrow()
    expect(() => setRunningCellEvalStatus(new Date())).toThrow()
    setRunningCellEvalStatus('ASYNC_PENDING')
    expect(runningEvalStatus()).toBe('ASYNC_PENDING')
    setRunningCellEvalStatus('SUCCESS')
    expect(runningEvalStatus()).toBe('SUCCESS')
    setRunningCellEvalStatus('ERROR')
    expect(runningEvalStatus()).toBe('ERROR')
  })

  it('correctly waits until waitForExplicitContinuationStatusResolution has resolved (async)', () => {
    jest.clearAllTimers()
    evalQueue.requireExplicitContinuation()
    waitForExplicitContinuationStatusResolution()
      .then(() => {
        expect(getRunningCellEvalStatus()).toBe('SUCCESS')
      })
      .catch((err) => { throw new Error(err) })
    expect(setInterval).toHaveBeenCalledTimes(1)
    evalQueue.continue()

    jest.runAllTimers()
  })

  it('correctly waits until waitForExplicitContinuationStatusResolution has resolved (sync)', () => {
    jest.clearAllTimers()
    waitForExplicitContinuationStatusResolution()
      .then(() => {
        expect(getRunningCellEvalStatus()).toBe('UNEVALUATED')
      })
      .catch((err) => { throw new Error(err) })
    // setInterval was called once before - the test above this one.
    expect(setInterval).toHaveBeenCalledTimes(1)
    jest.runAllTimers()
  })

  it('correctly awaits for Promises to resolve', () => {
    jest.clearAllTimers()

    evalQueue.await([
      Promise.resolve(10),
      Promise.resolve(20),
    ]).then((d) => {
      expect(d).toBe([10, 20])
      expect(getRunningCellEvalStatus()).toBe('UNEVALUATED')
    })

    jest.runAllTimers()
  })
})
