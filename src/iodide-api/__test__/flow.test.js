import {
  // getEvalStatus,
  setRunningCellEvalStatus,
  // waitForExplicitContinuationStatusResolution,
  flow,
} from '../flow'
import { store } from '../../store'
import { temporarilySaveRunningCellID, newNotebook } from '../../actions/actions'

describe('flow API', () => {
  beforeEach(() => {
    store.dispatch(newNotebook())
    store.dispatch(temporarilySaveRunningCellID(0))
  })

  const runningEvalStatus = () => store.getState().cells[0].evalStatus
  it('allows for explicit setting of cell continuation', () => {
    flow.requireExplicitContinuation()
    expect(runningEvalStatus()).toBe('ASYNC_PENDING')
    flow.continue()
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
})

// describe('user-facing api', () => {
//   it('has api properly setting internal value', () => {
//     flow.requireExplicitContinuation()
//     expect(getExplicitContinuationStatus()).toBe('PENDING')
//     flow.continue()
//     expect(getExplicitContinuationStatus()).toBe('RESOLVED')
//   })
// })

// describe('waitForExplicitResolutionOrContinue', () => {
//   it('correctly waits until resolution', () => {
//     jest.useFakeTimers()
//     jest.runAllTimers();
//     Promise.resolve()
//       .then(() => { flow.requireExplicitContinuation() })
//       .then(waitForExplicitContinuationStatusResolution)
//       .then(() => {
//         expect(getExplicitContinuationStatus()).toBe(null)
//       })
//     flow.continue()
//   })
// })
