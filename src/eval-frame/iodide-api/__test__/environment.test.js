import { environment } from '../environment'
import { store } from '../../store'
import { resetNotebook } from '../../actions/actions'

// FIXME
describe.skip('environment methods (integration test)', () => {
  beforeEach(() => {
    store.dispatch(resetNotebook())
  })

  it('freeze an environment with an object', () => {
    environment.freeze({ foo: { a: 1 } })
    expect(store.getState().savedEnvironment.foo)
      .toEqual(['object', 'N4IghiBcCMC+Q==='])
  })

  it('freeze an environment with a string', () => {
    environment.freeze({ foo: 'a test string' })
    expect(store.getState().savedEnvironment.foo)
      .toEqual(['string', 'IYAgLgpgzmIwTgSwHYHMg==='])
  })

  it('freeze an environment with a rawString', () => {
    environment.freezeRawString({ foo: 'a test string' })
    expect(store.getState().savedEnvironment.foo)
      .toEqual(['rawString', 'a test string'])
  })

  it('freeze a non-string as rawString should throw', () => {
    expect(() => { environment.freezeRawString({ foo: 123 }) }).toThrow()
  })

  it('appending a string object', () => {
    environment.freeze({ foo: { a: 1 } })
    environment.freeze({ bar: 'a test string' })
    expect(store.getState().savedEnvironment)
      .toEqual({
        foo: ['object', 'N4IghiBcCMC+Q==='],
        bar: ['string', 'IYAgLgpgzmIwTgSwHYHMg==='],
      })
  })

  it('appending a rawString object', () => {
    environment.freeze({ foo: { a: 1 } })
    environment.freezeRawString({ bar: 'a test string' })
    expect(store.getState().savedEnvironment)
      .toEqual({
        foo: ['object', 'N4IghiBcCMC+Q==='],
        bar: ['rawString', 'a test string'],
      })
  })

  it('clearing resets to an empty object', () => {
    environment.freeze({ foo: { a: 1 } })
    environment.freezeRawString({ bar: 'a test string' })
    environment.clear()
    expect(store.getState().savedEnvironment).toEqual({})
  })

  it('env.getting a single key returns original value stand alone (not in array)', () => {
    environment.freeze({ foo: { a: 1 } })
    environment.freezeRawString({ bar: 'a test string' })
    environment.freeze({ bat: 123 })
    expect(environment.get('foo')).toEqual({ a: 1 })
  })

  it('env.getting multiple keys returns original values in array', () => {
    environment.freeze({ foo: { a: 1 } })
    environment.freezeRawString({ bar: 'a test string' })
    environment.freeze({ bat: 123, boop: { b: 'string 2' } })
    expect(environment.get('foo', 'bat', 'boop', 'bar'))
      .toEqual([{ a: 1 }, 123, { b: 'string 2' }, 'a test string'])
  })

  it('env.get params must be strings (not an array)', () => {
    environment.freeze({ foo: { a: 1 } })
    environment.freezeRawString({ bar: 'a test string' })
    environment.freeze({ bat: 123, boop: { b: 'string 2' } })
    expect(() => { environment.get(['foo', 'bat']) }).toThrow()
  })

  it('env.list returns array of keys in environment', () => {
    environment.freeze({ foo: { a: 1 } })
    environment.freezeRawString({ bar: 'a test string' })
    environment.freeze({ bat: 123 })
    // inclusion in both directions for set equality
    expect(environment.list()).toEqual(expect.arrayContaining(['bar', 'foo', 'bat']))
    expect(['bar', 'foo', 'bat']).toEqual(expect.arrayContaining(environment.list()))
  })
})
