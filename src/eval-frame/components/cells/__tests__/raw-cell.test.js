import React from 'react'
import { shallow } from 'enzyme'

import { RawCellUnconnected as RawCell } from '../raw-cell'
import { CellContainer } from '../cell-container'
import CellRow from '../cell-row'

describe('RawCellUnconnected react component', () => {
  let props
  let mountedCell
  const cell = () => {
    if (!mountedCell) {
      mountedCell = shallow(<RawCell {...props} />)
    }
    return mountedCell
  }

  beforeEach(() => {
    props = {
      cellId: 5,
    }
    mountedCell = undefined
  })

  it('always renders one CellContainer', () => {
    expect(cell().find(CellContainer).length).toBe(1)
  })

  it('always renders one CellRow inside CellContainer', () => {
    expect(cell().wrap(cell().find(CellContainer))
      .find(CellRow)).toHaveLength(1)
  })

  it("sets the CellContainer cellId prop to be the RawCell's cellId prop", () => {
    expect(cell().find(CellContainer).props().cellId)
      .toBe(props.cellId)
  })

  it("sets the CellRow cellId prop to be the RawCell's cellId prop", () => {
    expect(cell().find(CellRow).props().cellId)
      .toBe(props.cellId)
  })

  it('sets the CellRow rowType prop to be output', () => {
    expect(cell().find(CellRow).props().rowType)
      .toBe('output')
  })
})
