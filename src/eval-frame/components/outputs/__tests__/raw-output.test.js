import React from 'react'
import { shallow } from 'enzyme'

import { RawOutputUnconnected as RawOutput } from '../raw-output'
import OutputContainer from '../output-container'
import OutputRow from '../output-row'

describe('RawOutputUnconnected react component', () => {
  let props
  let mountedCell
  const cell = () => {
    if (!mountedCell) {
      mountedCell = shallow(<RawOutput {...props} />)
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
    expect(cell().find(OutputContainer).length).toBe(1)
  })

  it('always renders one CellRow inside OutputContainer', () => {
    expect(cell().wrap(cell().find(OutputContainer))
      .find(OutputRow)).toHaveLength(1)
  })

  it("sets the OutputContainer cellId prop to be the RawOutput's cellId prop", () => {
    expect(cell().find(OutputContainer).props().cellId)
      .toBe(props.cellId)
  })

  it("sets the OutputRow cellId prop to be the RawOutput's cellId prop", () => {
    expect(cell().find(OutputRow).props().cellId)
      .toBe(props.cellId)
  })

  it('sets the OutputRow rowType prop to be output', () => {
    expect(cell().find(OutputRow).props().rowType)
      .toBe('output')
  })
})
