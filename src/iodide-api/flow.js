
let explicitResolutionStatusFlag

export const getExplicitContinuationStatus = () => explicitResolutionStatusFlag

export const setExplicitContinuationStatus = (val) => {
  const admissibleValues = new Set(['PENDING', 'RESOLVED', null])
  if (admissibleValues.has(val)) {
    explicitResolutionStatusFlag = val
  } else {
    throw new Error(`setExplicitResolutionStatus requires one of three flags: ${admissibleValues.join(', ')}`)
  }
}

export const waitForExplicitContinuationStatusResolution = () => new Promise((resolve) => {
  // poll for resolution, given there is no way to do this strictly w/ Promises
  if (getExplicitContinuationStatus() === 'PENDING') {
    const interval = setInterval(() => {
      if (getExplicitContinuationStatus() === 'RESOLVED') {
        setExplicitContinuationStatus(null)
        resolve()
        clearInterval(interval)
      }
    }, 50)
  } else {
    // continue
    setExplicitContinuationStatus(null)
    resolve()
  }
})

export const flow = {
  requireExplicitContinuation: () => { setExplicitContinuationStatus('PENDING') },
  continue: () => { setExplicitContinuationStatus('RESOLVED') },
}
