import { shallow } from 'enzyme'
import React from 'react'

import { CellContainerUnconnected, mapStateToProps } from '../cell-container'
import CellMenuContainer from '../cell-menu-container'
import CellRow from '../cell-row'
import CellEditor from '../cell-editor'

describe('CellContainerUnconnected React component', () => {
  let selectCell
  let props
  let mountedCont
  const node = <span>Hello</span>

  const cellContainer = () => {
    if (!mountedCont) {
      mountedCont = shallow(<CellContainerUnconnected {...props}>{node}</CellContainerUnconnected>)
    }
    return mountedCont
  }

  beforeEach(() => {
    selectCell = jest.fn()
    props = {
      selected: true,
      cellId: 1,
      editingCell: true,
      viewMode: 'editor',
      cellType: 'code',
      actions: { selectCell },
      editorOptions: { option1: 1, option2: 2 },
    }
    mountedCont = undefined
  })

  it('always renders two div', () => {
    expect(cellContainer().find('div').length).toBe(2)
  })

  it('always renders two children inside top div', () => {
    expect(cellContainer().find('div').at(0).children()
      .length).toBe(2)
  })

  it('sets the top div to have id cell-1', () => {
    expect(cellContainer().find('div').at(0).props().id)
      .toBe('cell-1')
  })

  it('sets the top div with correct class if selected===false and editingCell===false', () => {
    props.selected = false
    props.editingCell = false
    expect(cellContainer().find('div').at(0).props().className)
      .toBe('cell-container code')
  })

  it('sets the top div with correct class if selected===true and editingCell===false', () => {
    props.selected = true
    props.editingCell = false
    expect(cellContainer().find('div').at(0).props().className)
      .toBe('cell-container code selected-cell')
  })

  it('sets the top div with correct class if selected===false and editingCell===true', () => {
    props.selected = false
    props.editingCell = true
    expect(cellContainer().find('div').at(0).props().className)
      .toBe('cell-container code editing-cell')
  })

  it('sets the top div with correct class if selected===true and editingCell===true', () => {
    props.selected = true
    props.editingCell = true
    expect(cellContainer().find('div').at(0).props().className)
      .toBe('cell-container code selected-cell editing-cell')
  })

  it('sets the onMouseDown prop to handleCellClick', () => {
    expect(cellContainer().props().onMouseDown)
      .toEqual(cellContainer().instance().handleCellClick)
  })

  it('mouse down on cell container div fires selectCell with correct props', () => {
    props.viewMode = 'editor'
    props.selected = false
    cellContainer().simulate('mousedown')
    expect(selectCell.mock.calls.length).toBe(1)
    expect(selectCell.mock.calls[0].length).toBe(2)
  })

  const selectCellNotFiredVariants = [
    { selected: true, viewMode: 'editor' },
    { selected: false, viewMode: 'presentation' },
    { selected: true, viewMode: 'presentation' },
  ]

  selectCellNotFiredVariants.forEach((state) => {
    it('click on cell container div does not fires selectCell with incorrect props', () => {
      props.viewMode = state.viewMode
      props.selected = state.selected
      cellContainer().simulate('mousedown')
      expect(selectCell.mock.calls.length).toBe(0)
    })
  })

  it('always renders one CellMenuContainer inside top div', () => {
    expect(cellContainer().find('div').at(0)
      .find(CellMenuContainer)).toHaveLength(1)
  })

  it("sets the CellMenuContainer cellId prop to be the CellContainer's cellId prop", () => {
    expect(cellContainer().find(CellMenuContainer).props().cellId)
      .toBe(props.cellId)
  })

  it('always renders one div with class cell-row-container inside top div', () => {
    expect(cellContainer().wrap(cellContainer().find('div').at(0)
      .props().children).find('div.cell-row-container')).toHaveLength(1)
  })

  it('div.cell-row-container contains one CellRow', () => {
    expect(cellContainer().find('div.cell-row-container')
      .find(CellRow)).toHaveLength(1)
  })

  it('CellRow contains one CellEditor', () => {
    expect(cellContainer().find(CellRow)
      .find(CellEditor)).toHaveLength(1)
  })

  it('CellEditor gets correct props', () => {
    expect(cellContainer().find(CellEditor).props().cellId).toEqual(props.cellId)
    expect(cellContainer().find(CellEditor).props().editorOptions).toEqual(props.editorOptions)
  })
})

describe('CellContainer mapStateToProps', () => {
  let state

  beforeEach(() => {
    state = {
      cells: [{
        id: 5,
        selected: true,
        cellType: 'code',
      },
      ],
      mode: 'edit',
      viewMode: 'editor',
    }
  })

  it('should return the basic info for the correct cell', () => {
    const ownProps = { cellId: 5 }
    expect(mapStateToProps(state, ownProps))
      .toEqual({
        cellId: 5,
        selected: true,
        editingCell: true,
        viewMode: 'editor',
        cellType: 'code',
      })
  })

  it('should return editingCell as false if selected===false and mode===edit', () => {
    const ownProps = { cellId: 5 }
    state.mode = 'edit'
    state.cells[0].selected = false
    expect(mapStateToProps(state, ownProps))
      .toEqual({
        cellId: 5,
        selected: false,
        editingCell: false,
        viewMode: 'editor',
        cellType: 'code',
      })
  })

  it('should return editingCell as false if selected===true and mode===not_edit', () => {
    const ownProps = { cellId: 5 }
    state.mode = 'not_edit'
    state.cells[0].selected = true
    expect(mapStateToProps(state, ownProps))
      .toEqual({
        cellId: 5,
        selected: true,
        editingCell: false,
        viewMode: 'editor',
        cellType: 'code',
      })
  })

  it('should return editingCell as false if selected===false and mode===not_edit', () => {
    const ownProps = { cellId: 5 }
    state.mode = 'not_edit'
    state.cells[0].selected = false
    expect(mapStateToProps(state, ownProps))
      .toEqual({
        cellId: 5,
        selected: false,
        editingCell: false,
        viewMode: 'editor',
        cellType: 'code',
      })
  })
})
