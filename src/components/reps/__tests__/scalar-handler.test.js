import scalarHandler from '../scalar-handler'

describe('scalarHandler shouldHandle', () => {
  it('rejects non-scalar values', () => {
    expect(scalarHandler.shouldHandle(undefined)).toBe(false)
    expect(scalarHandler.shouldHandle(new Date())).toBe(false)
    expect(scalarHandler.shouldHandle([])).toBe(false)
    expect(scalarHandler.shouldHandle({})).toBe(false)
    expect(scalarHandler.shouldHandle(new Promise(() => {}))).toBe(false)
  })
  it('accepts scalar values', () => {
    expect(scalarHandler.shouldHandle(1)).toBe(true)
    expect(scalarHandler.shouldHandle(Infinity)).toBe(true)
    expect(scalarHandler.shouldHandle(NaN)).toBe(true)
    expect(scalarHandler.shouldHandle('string')).toBe(true)
    expect(scalarHandler.shouldHandle('')).toBe(true)
  })
})
