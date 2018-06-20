import React from 'react'
import { shallow } from 'enzyme'

import { PluginDefCellUnconnected as PluginDefCell } from '../plugin-definition-cell'
import { CellContainer } from '../cell-container'
import CellRow from '../cell-row'
import CellEditor from '../cell-editor'


describe('PluginCellUnconnected react component', () => {
  let props
  let mountedCell
  const cell = () => {
    if (!mountedCell) {
      mountedCell = shallow(<PluginDefCell {...props} />)
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

  it('always renders one CellEditor inside CellRow', () => {
    expect(cell().wrap(cell().find(CellRow))
      .find(CellEditor)).toHaveLength(1)
  })

  it("sets the CellContainer cellId prop to be the PluginDefCell's cellId prop", () => {
    expect(cell().find(CellContainer).props().cellId)
      .toBe(props.cellId)
  })

  it("sets the CellRow cellId prop to be the PluginDefCell's cellId prop", () => {
    expect(cell().find(CellRow).props().cellId)
      .toBe(props.cellId)
  })

  it('sets the CellRow rowType prop to be input', () => {
    expect(cell().find(CellRow).props().rowType)
      .toBe('input')
  })

  it("sets the CellEditor cellId prop to be the PluginDefCell's cellId prop", () => {
    expect(cell().find(CellEditor).props().cellId)
      .toBe(props.cellId)
  })
})
