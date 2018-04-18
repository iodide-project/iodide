
window.iodideRequireExplicitResolution = false
window.iodideRequireExplicitResolutionStatus = undefined

const expectResolution = () => {
  window.iodideRequireExplicitResolution = true
  window.iodideRequireExplicitResolutionStatus = 'pending'
  window.iodideExplicitResolver = new Promise((resolve) => {
    // poll for resolution, given there is no way to do this strictly w/ Promises
    const interval = setInterval(() => {
      if (window.iodideRequireExplicitResolutionStatus === 'resolved') {
        resolve()
        clearInterval(interval)
      }
    }, 100)
  })
}

const resolve = () => { console.log('RESOLUTION TIME'); window.iodideRequireExplicitResolutionStatus = 'resolved' }

export {
  expectResolution, resolve,
}
