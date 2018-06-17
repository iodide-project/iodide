import { shallow } from 'enzyme'
import React from 'react'

import { FrozenVariable } from '../frozen-variable'

describe('FrozenVariable React component', () => {
  let props
  let mountedVariable

  const frozenVariable = () => {
    if (!mountedVariable) {
      mountedVariable = shallow(<FrozenVariable {...props} />)
    }
    return mountedVariable
  }

  beforeEach(() => {
    props = {
      varName: 'x',
      byteLength: 42,
    }
    mountedVariable = undefined
  })

  it('always renders one div with class frozen-variable-name', () => {
    expect(frozenVariable().find('div.frozen-variable-name').length)
      .toBe(1)
  })

  it('always renders one div with class frozen-variable-value', () => {
    expect(frozenVariable().find('div.frozen-variable-name').length)
      .toBe(1)
  })

  it('always renders variable name inside frozen-variable-name', () => {
    expect(frozenVariable().wrap(frozenVariable().find('div.frozen-variable-name'))
      .text()).toBe('x')
  })

  const valueVariants = [
    { value: 42, size: '42 bytes' },
    { value: 4200, size: '4.2kb' },
    { value: 4200000, size: '4.2mb' },
    { value: 4200000000000, size: '4200gb' },
  ]

  valueVariants.forEach((variant) => {
    it('always renders correct size inside frozen-variable-value', () => {
      props.byteLength = variant.value
      expect(frozenVariable().wrap(frozenVariable().find('div.frozen-variable-value'))
        .text()).toBe(variant.size)
    })
  })
})
