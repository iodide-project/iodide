import React from 'react'
import { shallow } from 'enzyme'

import { CodeCellUnconnected as CodeCell } from '../code-cell'
import { CellContainer } from '../cell-container'
import CellRow from '../cell-row'
import CellOutput from '../cell-output'

describe('CodeCell_unconnected react component', () => {
  let props
  let mountedCell
  const cell = () => {
    if (!mountedCell) {
      mountedCell = shallow(<CodeCell {...props} />)
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
      .find(CellRow)).toHaveLength(2)
  })

  it('always renders one div inside CellRow 0', () => {
    expect(cell().wrap(cell().find(CellRow).at(0))
      .find('div')).toHaveLength(1)
  })

  it('always renders one CellOutput inside CellRow 1', () => {
    expect(cell().wrap(cell().find(CellRow).at(1))
      .find(CellOutput)).toHaveLength(1)
  })

  it("sets the CellContainer cellId prop to be the CodeCell's cellId prop", () => {
    expect(cell().find(CellContainer).props().cellId)
      .toBe(props.cellId)
  })

  it("sets the 1st CellRow cellId prop to be the CodeCell's cellId prop", () => {
    expect(cell().find(CellRow).at(0).props().cellId)
      .toBe(props.cellId)
  })

  it("sets the 2nd CellRow cellId prop to be the CodeCell's cellId prop", () => {
    expect(cell().find(CellRow).at(1).props().cellId)
      .toBe(props.cellId)
  })

  it('sets the 1st CellRow rowType prop to be sideeffect', () => {
    expect(cell().find(CellRow).at(0).props().rowType)
      .toBe('sideeffect')
  })

  it('sets the 2nd CellRow rowType prop to be output', () => {
    expect(cell().find(CellRow).at(1).props().rowType)
      .toBe('output')
  })

  it('sets the div in the sideeffect row to have class side-effect-target', () => {
    expect(cell().find('div').props().className)
      .toBe('side-effect-target')
  })
})
