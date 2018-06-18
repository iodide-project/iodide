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
    expect(arrayHandler.shouldHandle(new Int8Array([-127, 127]))).toBe(true)
    expect(arrayHandler.shouldHandle(new Uint8Array([0, 255]))).toBe(true)
    expect(arrayHandler.shouldHandle(new Uint8ClampedArray([0, 257]))).toBe(true)
    expect(arrayHandler.shouldHandle(new Int16Array([-32768, 32767]))).toBe(true)
    expect(arrayHandler.shouldHandle(new Uint16Array([0, 65535]))).toBe(true)
    expect(arrayHandler.shouldHandle(new Int32Array([-2147483648, 2147483647]))).toBe(true)
    expect(arrayHandler.shouldHandle(new Float32Array([-230430430.2343, 20]))).toBe(true)
    expect(arrayHandler.shouldHandle(new Float64Array([-230430430.2343, 20, 1230230230.2343])))
      .toBe(true)
  })
})
