import { shallow } from 'enzyme'
import React from 'react'

import { MarkdownCellUnconnected } from '../markdown-cell'
import CellEditor from '../cell-editor'
import CellRow from '../cell-row'
import { CellContainer } from '../cell-container'

describe('MarkdownCell_unconnected react component', () => {
  let props
  let mountedCell

  const cell = () => {
    if (!mountedCell) {
      mountedCell = shallow(<MarkdownCellUnconnected {...props} />)
    }
    return mountedCell
  }

  beforeEach(() => {
    props = {
      cellId: 1,
    }
    mountedCell = undefined
  })

  it('always renders one CellContainer', () => {
    expect(cell().find(CellContainer).length).toBe(1)
  })

  it("sets the CellContainer cellId prop to be the MarkdownCell's cellId prop", () => {
    expect(cell().find(CellContainer).props().cellId)
      .toBe(props.cellId)
  })

  it('the CellContainer should have two CellRow', () => {
    expect(cell().wrap(cell().find(CellContainer))
      .find(CellRow)).toHaveLength(1)
  })

  it("sets the first CellRow cellId prop to be the MarkdownCell's cellId prop", () => {
    expect(cell().find(CellRow).at(0).props().cellId)
      .toBe(props.cellId)
  })

  it('sets the first CellRow rowType prop to be input', () => {
    expect(cell().find(CellRow).at(0).props().rowType)
      .toBe('input')
  })

  it('the first CellRow always has a child that is a CellEditor', () => {
    expect(cell().wrap(cell().find(CellRow).at(0)
      .props().children).find(CellEditor)).toHaveLength(1)
  })
})
