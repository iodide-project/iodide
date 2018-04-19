import { getExplicitContinuationStatus,
  setExplicitContinuationStatus,
  waitForExplicitContinuationStatusResolution,
  flow,
} from '../flow'


describe('setExplicitResolutionStatus accepts the right arguments', () => {
  it('accepts PENDING, RESOLVED, and null', () => {
    expect(() => setExplicitContinuationStatus('PENDING')).not.toThrow()
    expect(() => setExplicitContinuationStatus('RESOLVED')).not.toThrow()
    expect(() => setExplicitContinuationStatus(null)).not.toThrow()
    expect(() => setExplicitContinuationStatus()).toThrow()
    expect(() => setExplicitContinuationStatus('some other string')).toThrow()
  })
  it('correctly sets the flag', () => {
    setExplicitContinuationStatus('PENDING')
    expect(getExplicitContinuationStatus()).toBe('PENDING')
    setExplicitContinuationStatus('RESOLVED')
    expect(getExplicitContinuationStatus()).toBe('RESOLVED')
    setExplicitContinuationStatus(null)
    expect(getExplicitContinuationStatus()).toBe(null)
  })
})

describe('user-facing api', () => {
  it('has api properly setting internal value', () => {
    flow.requireExplicitContinuation()
    expect(getExplicitContinuationStatus()).toBe('PENDING')
    flow.continue()
    expect(getExplicitContinuationStatus()).toBe('RESOLVED')
  })
})

describe('waitForExplicitResolutionOrContinue', () => {
  it('correctly waits until resolution', () => {
    jest.useFakeTimers()
    jest.runAllTimers();
    Promise.resolve()
      .then(() => { flow.requireExplicitContinuation() })
      .then(waitForExplicitContinuationStatusResolution)
      .then(() => {
        expect(getExplicitContinuationStatus()).toBe(null)
      })
    flow.continue()
  })
})
