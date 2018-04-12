import undefinedHandler from '../undefined-handler'

describe('nullHandler shouldHandle', () => {
  it('rejects non-undefined values', () => {
    expect(undefinedHandler.shouldHandle('hello')).toBe(false)
    expect(undefinedHandler.shouldHandle('')).toBe(false)
    expect(undefinedHandler.shouldHandle(new Date())).toBe(false)
    expect(undefinedHandler.shouldHandle([])).toBe(false)
    expect(undefinedHandler.shouldHandle({})).toBe(false)
    expect(undefinedHandler.shouldHandle(new Promise(() => {}))).toBe(false)
    expect(undefinedHandler.shouldHandle(null)).toBe(false)
  })
  it('accepts undefined values', () => {
    expect(undefinedHandler.shouldHandle(undefined)).toBe(true)
  })
})
