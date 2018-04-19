
let explicitResolutionStatusFlag

export const explicitResolutionStatus = () => explicitResolutionStatusFlag

export const setExplicitResolutionStatus = (val) => {
  const admissibleValues = new Set(['pending', 'resolved', undefined])
  if (admissibleValues.has(val)) explicitResolutionStatusFlag = val
  else {
    throw Error(`setExplicitResolutionStatus requires one of three flags: ${admissibleValues.join(', ')}`)
  }
}

export const waitForExplicitResolution = () => new Promise((resolve) => {
  // poll for resolution, given there is no way to do this strictly w/ Promises
  const interval = setInterval(() => {
    if (explicitResolutionStatus() === 'resolved') {
      setExplicitResolutionStatus(undefined)
      resolve()
      clearInterval(interval)
    }
  }, 50)
})

export const expectResolution = () => { setExplicitResolutionStatus('pending') }

export const resolve = () => { setExplicitResolutionStatus('resolved') }

