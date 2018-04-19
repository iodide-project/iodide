
let explicitResolutionStatusFlag

export const explicitResolutionStatus = () => explicitResolutionStatusFlag

export const setExplicitResolutionStatus = (val) => {
  const admissibleValues = new Set(['pending', 'resolved', null])
  if (admissibleValues.has(val)) {
    explicitResolutionStatusFlag = val
  } else {
    throw new Error(`setExplicitResolutionStatus requires one of three flags: ${admissibleValues.join(', ')}`)
  }
}

export const waitForExplicitResolutionOrContinue = () => new Promise((resolve) => {
  // poll for resolution, given there is no way to do this strictly w/ Promises
  if (explicitResolutionStatus() === 'pending') {
    const interval = setInterval(() => {
      if (explicitResolutionStatus() === 'resolved') {
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
  requireExplicitContinuation: () => { setExplicitResolutionStatus('pending') },
  continue: () => { setExplicitResolutionStatus('resolved') },
}
