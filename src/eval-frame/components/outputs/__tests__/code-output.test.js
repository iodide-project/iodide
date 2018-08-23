import React from 'react'
import { shallow } from 'enzyme'

import { CodeOutputUnconnected as CodeOutput } from '../code-output'
import OutputContainer from '../output-container'

describe('CodeOutput_unconnected react component', () => {
  let props
  let mountedCell
  const output = () => {
    if (!mountedCell) {
      mountedCell = shallow(<CodeOutput {...props} />)
    }
    return mountedCell
  }

  beforeEach(() => {
    props = {
      cellId: 5,
      showSideEffectRow: false,
      showOutputRow: false,
    }
    mountedCell = undefined
  })

  it('always renders one OutputContainer', () => {
    expect(output().find(OutputContainer))
      .toHaveLength(1)
  })

  it('always renders a side-effect-target div', () => {
    expect(output().find('div'))
      .toHaveLength(1)

    expect(output().find('div').at(0).props().className)
      .toBe('side-effect-target')
  })
})
