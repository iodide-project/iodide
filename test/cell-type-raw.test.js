import React from 'react'
import { shallow } from 'enzyme'

import { RawCellUnconnected as RawCell } from '../src/components/cell-type-raw'
import CellEditor from '../src/components/cell-editor'
import OneRowCell from '../src/components/one-row-cell'


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

  it('always renders one OneRowCell', () => {
    expect(cell().find(OneRowCell).length).toBe(1)
  })

  it('sets the OneRowCell cellId prop to be the RawCell cellId input prop', () => {
    expect(cell().find(OneRowCell).props().cellId)
      .toBe(props.cellId)
  })

  it('is a OneRowCell with one child', () => {
    expect(cell().find(OneRowCell).children().length).toBe(1)
  })

  it('has a cell CellEditor within its OneRowCell', () => {
    expect(cell().find(CellEditor).parent().is(OneRowCell)).toEqual(true)
  })

  it('always renders one CellEditor', () => {
    expect(cell().find(CellEditor).length).toBe(1)
  })

  it('sets the CellEditor cellId prop to be the RawCell cellId input prop', () => {
    expect(cell().find(CellEditor).props().cellId)
      .toBe(props.cellId)
  })
})
