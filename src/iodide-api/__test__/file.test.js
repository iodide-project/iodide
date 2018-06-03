import { toCSVString } from '../file'

const d1 = [1, 2, 3, 4, 5]
const d2 = [new Date('2010-01-01'), new Date('2010-01-02')]
const d3 = 'test string'
const d4 = 10000000.234
const d5 = new Int16Array([5, 3, 2, 1])
const d6 = {
  a: 1,
  b: 2,
}
const d7 = [[1, 2, 3], [4, 5, 6]]
const d8 = [
  { a: 10, b: 20 }, { a: 1, b: 2 },
]
const d9 = [
  { a: 10, b: new Date() }, { a: 1, b: new Date() },
]
const d10 = [
  { a: 10, b: { n: 1 } }, { a: 1, b: { n: 1000 } },
]

const d11 = () => { console.log('this should break!') }

// embedded fcns in array of objects?
const d12 = [
  { a: 10, b: () => 100 }, { a: 20, b: () => 200 },
]

describe('toCSVString transformations', () => {
  it('transforms arrays of values', () => {
    expect(toCSVString(d1)).toBe('1\r\n2\r\n3\r\n4\r\n5')
    expect(toCSVString(d2)).toBe(`${d2[0].toString()}\r\n${d2[1].toString()}`)
    expect(() => toCSVString(d3)).toThrow() // is this right?
    expect(() => toCSVString(d4)).toThrow() // is this right?
    expect(toCSVString(d5)).toBe('5\r\n3\r\n2\r\n1')
    expect(() => toCSVString(d6)).toThrow()
    expect(toCSVString(d7)).toBe('c1,c2,c3\r\n1,2,3\r\n4,5,6')
    expect(toCSVString(d8)).toBe('a,b\r\n10,20\r\n1,2')
    expect(toCSVString(d9)).toBe(`a,b\r\n10,${d9[0].b.toString()}\r\n1,${d9[1].b.toString()}`)
    expect(toCSVString(d10)).toBe('a,b\r\n10,[object Object]\r\n1,[object Object]')
    expect(() => toCSVString(d11)).toThrow()
    // should functions be expressed w/ toString like this, or as [function Function] or whatver?
    expect(toCSVString(d12)).toBe(`a,b\r\n10,${d12[0].b.toString()}\r\n20,${d12[1].b.toString()}`)
  })
})

