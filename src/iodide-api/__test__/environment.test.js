// import LZString from 'lz-string'
// import _ from 'lodash'

import { environment } from '../environment'
import { store } from '../../store'
// import { newNotebook } from '../../state-prototypes'
import { newNotebook } from '../../actions/actions'


describe('environment methods work correctly (integration test)', () => {
  beforeEach(() => {
    store.dispatch(newNotebook())
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
    environment.freeze({ bat: 123 })
    expect(environment.get(['foo', 'bat', 'bar']))
      .toEqual([{ a: 1 }, 123, 'a test string'])
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
