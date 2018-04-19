import { explicitResolutionStatus,
  setExplicitResolutionStatus,
  // waitForExplicitResolutionOrContinue,
  flow,
} from '../resolve'

describe('setExplicitResolutionStatus accepts the right arguments', () => {
  it('accepts pending, resolved, and undefined', () => {
    expect(() => setExplicitResolutionStatus('pending')).not.toThrow()
    expect(() => setExplicitResolutionStatus('resolved')).not.toThrow()
    expect(() => setExplicitResolutionStatus(null)).not.toThrow()
    expect(() => setExplicitResolutionStatus()).toThrow()
    expect(() => setExplicitResolutionStatus('some other string')).toThrow()
  })
  it('correctly sets the flag', () => {
    setExplicitResolutionStatus('pending')
    expect(explicitResolutionStatus()).toBe('pending')
    setExplicitResolutionStatus('resolved')
    expect(explicitResolutionStatus()).toBe('resolved')
    setExplicitResolutionStatus(null)
    expect(explicitResolutionStatus()).toBe(null)
  })
})

describe('user-facing api', () => {
  it('has api properly setting internal value', () => {
    flow.requireExplicitContinuation()
    expect(explicitResolutionStatus()).toBe('pending')
    flow.continue()
    expect(explicitResolutionStatus()).toBe('resolved')
  })
})

// describe('waitForExplicitResolutionOrContinue', () => {
//   const pr = Promise.resolve()
//     .then(() => { expectResolution() })
//     .then(waitForExplicitResolutionOrContinue)

//   setTimeout(() => {
//     resolve()
//     pr = pr.then(() => {
//       console.log('ok here we are')
//       expect(explicitResolutionStatus()).toBe(null)
//     })
//       .catch(() => {
//         console.error('waitForExplicitResolutionOrContinue is broken')
//       })
//   }, 120)
// })
