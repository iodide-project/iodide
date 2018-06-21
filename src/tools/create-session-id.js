function dec2hex(dec) {
  return (`0${dec.toString(16)}`).substr(-2)
}

// generateSessionId :: Integer -> String
export function createSessionId() {
  const arr = new Uint8Array(8) // gives 16 chars
  window.crypto.getRandomValues(arr)
  return Array.from(arr, dec2hex).join('')
}
