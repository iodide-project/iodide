import { shallow } from 'enzyme'
import React from 'react'

import { MarkdownCellUnconnected, mapStateToProps } from '../markdown-cell'
import CellEditor from '../cell-editor'
import CellRow from '../cell-row'
import { CellContainer } from '../cell-container'

describe('MarkdownCell_unconnected react component', () => {
  let props
  let mountedCell
  let markCellNotRendered
  let changeMode

  const cell = () => {
    if (!mountedCell) {
      mountedCell = shallow(<MarkdownCellUnconnected {...props} />)
    }
    return mountedCell
  }

  beforeEach(() => {
    markCellNotRendered = jest.fn()
    changeMode = jest.fn()
    props = {
      cellId: 1,
      value: 'a _markdown_ string',
      viewMode: 'editor',
      actions: { markCellNotRendered, changeMode },
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

  it('sets the 1st CellRow rowType prop to be output', () => {
    expect(cell().find(CellRow).at(0).props().rowType)
      .toBe('output')
  })

  it('the  CellRow always has a child that is is a div', () => {
    expect(cell().wrap(cell().find(CellRow).at(0)
      .props().children).find('div')).toHaveLength(1)
  })

  it('div should have dangerouslySetInnerHTML', () => {
    props.value = 'html string'
    expect(cell().wrap(cell().find('div')).props().dangerouslySetInnerHTML)
      .toEqual({ __html: props.value })
  })
})
