import arrayHandler from '../array-handler'

describe('dateHandler shouldHandle', () => {
  it('rejects non-scalar values', () => {
    expect(arrayHandler.shouldHandle(undefined)).toBe(false)
    expect(arrayHandler.shouldHandle({})).toBe(false)
    expect(arrayHandler.shouldHandle(new Promise(() => {}))).toBe(false)
    expect(arrayHandler.shouldHandle('string')).toBe(false)
    expect(arrayHandler.shouldHandle(4000)).toBe(false)
  })
  it('accepts array objects', () => {
    expect(arrayHandler.shouldHandle([])).toBe(true)
    expect(arrayHandler.shouldHandle(new Array(10000))).toBe(true)
    expect(arrayHandler.shouldHandle([1, 2, 3, 4, 5])).toBe(true)
    // TODO - make this pass.
    // expect(arrayHandler.shouldHandle(new Float64Array(100000))).toBe(true)
  })
})
