
let explicitResolutionStatusFlag

export const getExplicitResolutionStatus = () => explicitResolutionStatusFlag

export const setExplicitResolutionStatus = (val) => {
  const admissibleValues = new Set(['PENDING', 'RESOLVED', null])
  if (admissibleValues.has(val)) {
    explicitResolutionStatusFlag = val
  } else {
    throw new Error(`setExplicitResolutionStatus requires one of three flags: ${admissibleValues.join(', ')}`)
  }
}

export const waitForExplicitResolutionOrContinue = () => new Promise((resolve) => {
  // poll for resolution, given there is no way to do this strictly w/ Promises
  if (getExplicitResolutionStatus() === 'PENDING') {
    const interval = setInterval(() => {
      if (getExplicitResolutionStatus() === 'RESOLVED') {
        setExplicitResolutionStatus(null)
        resolve()
        clearInterval(interval)
      }
    }, 50)
  } else {
    // continue
    setExplicitResolutionStatus(null)
    resolve()
  }
})

export const flow = {
  requireExplicitContinuation: () => { setExplicitResolutionStatus('PENDING') },
  continue: () => { setExplicitResolutionStatus('RESOLVED') },
}
