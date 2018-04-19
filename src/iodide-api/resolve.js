
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
      console.log('Now it is time to move on.')
      setExplicitResolutionStatus(undefined)
      resolve()
      clearInterval(interval)
    }
  }, 50)
})

export const expectResolution = () => {
  explicitResolutionStatusFlag = 'pending'
  // explicitResolver = new Promise((resolve) => {
  //   // poll for resolution, given there is no way to do this strictly w/ Promises
  //   const interval = setInterval(() => {
  //     if (explicitResolutionStatusFlag === 'resolved') {
  //       resolve()
  //       clearInterval(interval)
  //     }
  //   }, 50)
  // })
}

export const resolve = () => { explicitResolutionStatusFlag = 'resolved' }

