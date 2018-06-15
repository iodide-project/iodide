import nb from '../nb'

describe('nb.isRowDf', () => {
  it('accepts the following values', () => {
    expect(nb.isRowDf([{ a: 10, b: 20 }])).toBe(true)
    expect(nb.isRowDf([{ a: 10 }, { a: 20 }])).toBe(true)
    expect(nb.isRowDf([{}])).toBe(true)
  })
  it('rejects the following values', () => {
    expect(nb.isRowDf(undefined)).toBe(false)
    expect(nb.isRowDf(null)).toBe(false)
    expect(nb.isRowDf([undefined])).toBe(false)
    expect(nb.isRowDf(['test'])).toBe(false)
    expect(nb.isRowDf([new Date()])).toBe(false)
    expect(nb.isRowDf({})).toBe(false)
    expect(nb.isRowDf([])).toBe(false)
    expect(nb.isRowDf([1, 2, 3, 4])).toBe(false)
  })
})

describe('nb.isMatrix', () => {
  it('accepts the following values', () => {
    expect(nb.isMatrix([[1, 2, 3], [4, 5, 6]])).toBe(true)
    expect(nb.isMatrix([[1, 2, 3], [4, 6]])).toBe(true)
    expect(nb.isMatrix([[1, 2, 3], []])).toBe(true)
    expect(nb.isMatrix([[], []])).toBe(true)
  })
})
