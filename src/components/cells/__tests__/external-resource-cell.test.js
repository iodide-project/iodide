import React from 'react'
import { shallow } from 'enzyme'


import { ExternalResourceCellUnconnected as ExternalResourceCell } from '../external-resource-cell'
import { CellContainer } from '../cell-container'
import CellRow from '../cell-row'
import CellEditor from '../cell-editor'

describe('ExternalResourceCellUnconnected contains the expected child components', () => {
  let props
  let mountedCell
  const cell = () => {
    if (!mountedCell) {
      mountedCell = shallow(<ExternalResourceCell {...props} />)
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

  it('always renders two CellRow inside CellContainer', () => {
    expect(cell().wrap(cell().find(CellContainer))
      .find(CellRow)).toHaveLength(1)
  })

  it('always renders one CellEditor inside first CellRow', () => {
    expect(cell().wrap(cell().find(CellRow).at(0))
      .find(CellEditor)).toHaveLength(1)
  })

  it("sets the CellContainer cellId prop to be the ExternalResourceCells's cellId prop", () => {
    expect(cell().find(CellContainer).props().cellId)
      .toBe(props.cellId)
  })

  it("sets the first CellRow cellId prop to be the ExternalResourceCells's cellId prop", () => {
    expect(cell().find(CellRow).at(0).props().cellId)
      .toBe(props.cellId)
  })

  it('sets the first CellRow rowType prop to be input', () => {
    expect(cell().find(CellRow).at(0).props().rowType)
      .toBe('input')
  })

  it("sets the CellEditor cellId prop to be the ExternalResourceCells's cellId prop", () => {
    expect(cell().find(CellEditor).props().cellId)
      .toBe(props.cellId)
  })
})
