import nullHandler from '../null-handler'

describe('nullHandler shouldHandle', () => {
  it('rejects non-null values', () => {
    expect(nullHandler.shouldHandle('hello')).toBe(false)
    expect(nullHandler.shouldHandle('')).toBe(false)
    expect(nullHandler.shouldHandle(undefined)).toBe(false)
    expect(nullHandler.shouldHandle(new Date())).toBe(false)
    expect(nullHandler.shouldHandle([])).toBe(false)
    expect(nullHandler.shouldHandle({})).toBe(false)
    expect(nullHandler.shouldHandle(new Promise(() => {}))).toBe(false)
    expect(nullHandler.shouldHandle('null')).toBe(false)
  })
  it('accepts null values', () => {
    expect(nullHandler.shouldHandle(null)).toBe(true)
  })
})
