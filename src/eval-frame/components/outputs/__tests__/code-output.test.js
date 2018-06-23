import React from 'react'
import { shallow } from 'enzyme'

import { CodeOutputUnconnected as CodeOutput } from '../code-output'
import OutputContainer from '../output-container'
import OutputRow from '../output-row'
import OutputRenderer from '../output-renderer'

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
    }
    mountedCell = undefined
  })

  it('always renders one OutputContainer', () => {
    expect(output().find(OutputContainer).length).toBe(1)
  })

  it('always renders two OutputRow inside OutputContainer', () => {
    expect(output().wrap(output().find(OutputContainer))
      .find(OutputRow)).toHaveLength(2)
  })

  it('always renders one div inside OutputRow 0', () => {
    expect(output().wrap(output().find(OutputRow).at(0))
      .find('div')).toHaveLength(1)
  })

  it('always renders one CellOutput inside OutputRow 1', () => {
    expect(output().wrap(output().find(OutputRow).at(1))
      .find(OutputRenderer)).toHaveLength(1)
  })

  it("sets the OutputContainer cellId prop to be the CodeOutput's cellId prop", () => {
    expect(output().find(OutputContainer).props().cellId)
      .toBe(props.cellId)
  })

  it("sets the 1st OutputRow cellId prop to be the CodeOutput's cellId prop", () => {
    expect(output().find(OutputRow).at(0).props().cellId)
      .toBe(props.cellId)
  })

  it("sets the 2nd OutputRow cellId prop to be the CodeOutput's cellId prop", () => {
    expect(output().find(OutputRow).at(1).props().cellId)
      .toBe(props.cellId)
  })

  it('sets the 1st OutputRow rowType prop to be sideeffect', () => {
    expect(output().find(OutputRow).at(0).props().rowType)
      .toBe('sideeffect')
  })

  it('sets the 2nd OutputRow rowType prop to be output', () => {
    expect(output().find(OutputRow).at(1).props().rowType)
      .toBe('output')
  })

  it('sets the div in the sideeffect row to have class side-effect-target', () => {
    expect(output().find('div').props().className)
      .toBe('side-effect-target')
  })
})
