import matrixHandler from '../matrix-handler'

describe('dateHandler shouldHandle', () => {
  it('rejects non-matrix values', () => {
    expect(matrixHandler.shouldHandle(undefined)).toBe(false)
    expect(matrixHandler.shouldHandle([])).toBe(false)
    expect(matrixHandler.shouldHandle({})).toBe(false)
    expect(matrixHandler.shouldHandle(new Promise(() => {}))).toBe(false)
    expect(matrixHandler.shouldHandle('string')).toBe(false)
    expect(matrixHandler.shouldHandle(4000)).toBe(false)
    expect(matrixHandler.shouldHandle('2010-01-01')).toBe(false)
  })
  it('accepts arrays of arrays of same length', () => {
    expect(matrixHandler.shouldHandle([[1, 2, 3, 4], [3, 2, 1, 2]])).toBe(true)
    // this should be true
    expect(matrixHandler.shouldHandle([[1], [3]])).toBe(true)
  })
  it('accepts arrays of arrays of differing length', () => {
    expect(matrixHandler.shouldHandle([[1, 2, 3, 4], [3, 1, 2]])).toBe(true)
    // this should be true
    expect(matrixHandler.shouldHandle([[1], []])).toBe(true)
  })
})
