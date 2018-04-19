import { getExplicitResolutionStatus,
  setExplicitResolutionStatus,
  waitForExplicitResolutionOrContinue,
  flow,
} from '../flow'


describe('setExplicitResolutionStatus accepts the right arguments', () => {
  it('accepts PENDING, RESOLVED, and null', () => {
    expect(() => setExplicitResolutionStatus('PENDING')).not.toThrow()
    expect(() => setExplicitResolutionStatus('RESOLVED')).not.toThrow()
    expect(() => setExplicitResolutionStatus(null)).not.toThrow()
    expect(() => setExplicitResolutionStatus()).toThrow()
    expect(() => setExplicitResolutionStatus('some other string')).toThrow()
  })
  it('correctly sets the flag', () => {
    setExplicitResolutionStatus('PENDING')
    expect(getExplicitResolutionStatus()).toBe('PENDING')
    setExplicitResolutionStatus('RESOLVED')
    expect(getExplicitResolutionStatus()).toBe('RESOLVED')
    setExplicitResolutionStatus(null)
    expect(getExplicitResolutionStatus()).toBe(null)
  })
})

describe('user-facing api', () => {
  it('has api properly setting internal value', () => {
    flow.requireExplicitContinuation()
    expect(getExplicitResolutionStatus()).toBe('PENDING')
    flow.continue()
    expect(getExplicitResolutionStatus()).toBe('RESOLVED')
  })
})

describe('waitForExplicitResolutionOrContinue', () => {
  it('correctly waits until resolution', () => {
    jest.useFakeTimers()
    jest.runAllTimers();
    Promise.resolve()
      .then(() => { flow.requireExplicitContinuation(); console.log(getExplicitResolutionStatus()) })
      .then(waitForExplicitResolutionOrContinue)
      .then(() => {
        expect(getExplicitResolutionStatus()).toBe(null)
      })
    flow.continue()
  })
})
