import { shallow } from 'enzyme'
import React from 'react'
import promiseHandler, { PromiseRep } from '../promise-handler'

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


describe('PromiseRep', () => {
  it('resolves correctly', () => {
    const val = 'test value'
    const pr = new Promise((resolve) => {
      const newValue = val
      resolve(newValue)
    })
    const rep = shallow(<PromiseRep promise={pr} />)
    rep.state().promise.then((v) => {
      expect(v).toBe(val)
      expect(rep.state().status).toBe('resolved')
    })
      .catch(() => {})
  })
  it('rejects correctly', () => {
    const val = 'test value'
    const pr = Promise.reject(val)
    const rep = shallow(<PromiseRep promise={pr} />)
    rep.state().promise.then((v) => {
      expect(v).toBe(val)
      expect(rep.state().status).toBe('rejected')
    })
      .catch(() => {
      })
  })
})
