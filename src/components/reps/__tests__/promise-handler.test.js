import promiseHandler from '../promise-handler'

describe('promiseHandler shouldHandle', () => {
  it('rejects non-promise values', () => {
    expect(promiseHandler.shouldHandle(undefined)).toBe(false)
    expect(promiseHandler.shouldHandle([])).toBe(false)
    expect(promiseHandler.shouldHandle({})).toBe(false)
    expect(promiseHandler.shouldHandle('string')).toBe(false)
    expect(promiseHandler.shouldHandle(4000)).toBe(false)
    expect(promiseHandler.shouldHandle('2010-01-01')).toBe(false)
  })
  it('accepts Promise objects', () => {
    expect(promiseHandler.shouldHandle(Promise.resolve())).toBe(true)
    expect(promiseHandler.shouldHandle(Promise.reject())).toBe(true)
    expect(promiseHandler.shouldHandle(Promise.all([
      Promise.resolve(), Promise.resolve(),
    ]))).toBe(true)
  })
})
