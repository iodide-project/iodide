import dateHandler from '../date-handler'

describe('dateHandler shouldHandle', () => {
  it('rejects non-scalar values', () => {
    expect(dateHandler.shouldHandle(undefined)).toBe(false)
    expect(dateHandler.shouldHandle([])).toBe(false)
    expect(dateHandler.shouldHandle({})).toBe(false)
    expect(dateHandler.shouldHandle(new Promise(() => {}))).toBe(false)
    expect(dateHandler.shouldHandle('string')).toBe(false)
    expect(dateHandler.shouldHandle(4000)).toBe(false)
    expect(dateHandler.shouldHandle('2010-01-01')).toBe(false)
  })
  it('accepts Date objects', () => {
    expect(dateHandler.shouldHandle(new Date())).toBe(true)
    expect(dateHandler.shouldHandle(new Date('2020-04-04'))).toBe(true)
    expect(dateHandler.shouldHandle(new Date('invalid date string'))).toBe(true)
  })
})
