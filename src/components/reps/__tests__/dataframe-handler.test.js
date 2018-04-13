import dataframeHandler from '../dataframe-handler'

describe('dateHandler shouldHandle', () => {
  it('rejects non-scalar values', () => {
    expect(dataframeHandler.shouldHandle(undefined)).toBe(false)
    expect(dataframeHandler.shouldHandle({})).toBe(false)
    expect(dataframeHandler.shouldHandle(new Promise(() => {}))).toBe(false)
    expect(dataframeHandler.shouldHandle('string')).toBe(false)
    expect(dataframeHandler.shouldHandle(4000)).toBe(false)
    expect(dataframeHandler.shouldHandle([1, 2, 3, 4, 5])).toBe(false)
  })
  it('accepts array objects of same size and key composition', () => {
    expect(dataframeHandler.shouldHandle([{ a: 10, b: 20 }])).toBe(true)
    expect(dataframeHandler.shouldHandle([
      {
        a: 10, b: 'a', c: new Date(), e: [], f: undefined, g: null,
      },
      {
        a: 20, b: 'b', c: new Date(), e: [], f: undefined, g: null,
      },
    ])).toBe(true)
  })
  it('accepts arrays of objects of same key composition but differing data types', () => {
    expect(dataframeHandler.shouldHandle([
      {
        a: 10, b: 'a', c: new Date(), e: [], f: undefined, g: null,
      },
      {
        a: '20', b: 4, c: +(new Date()), e: {}, f: undefined, g: null,
      },
    ])).toBe(true)
  })
  it('rejects heterogeneous arrays of objects of differing keys', () => {
    expect(dataframeHandler.shouldHandle([
      {
        a: 10, b: 'a', c: new Date(), e: [], f: undefined, g: null,
      },
      {
        a: '20', b: 4, c: +(new Date()), e: {}, f: undefined, h: null,
      },
    ])).toBe(false)
  })
  it('rejects heterogeneous arrays of objects of differing sizes', () => {
    expect(dataframeHandler.shouldHandle([
      {
        a: 10, b: 'a', c: new Date(), e: [], f: undefined, g: null,
      },
      {
        a: '20', b: 4, c: +(new Date()), e: {},
      },
    ])).toBe(false)
  })
})
