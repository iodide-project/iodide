import { shallow } from 'enzyme'
import React from 'react'

import { OutputContainerUnconnected, mapStateToProps } from '../output-container'

describe('OutputContainerUnconnected React component', () => {
  let selectCell
  let props
  let mc
  const node = <span>Hello</span>

  const outputContainer = () => {
    if (!mc) {
      mc = shallow(<OutputContainerUnconnected {...props}>{node}</OutputContainerUnconnected>)
    }
    return mc
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
    }
    mc = undefined
  })

  it('always renders two div', () => {
    expect(outputContainer().find('div').length).toBe(2)
  })

  it('always renders 1 children inside top div', () => {
    expect(outputContainer().find('div').at(0).children()
      .length).toBe(1)
  })

  it('sets the top div to have id cell-1', () => {
    expect(outputContainer().find('div').at(0).props().id)
      .toBe('cell-1')
  })

  it('sets the top div with correct class if selected===false and editingCell===false', () => {
    props.selected = false
    props.editingCell = false
    expect(outputContainer().find('div').at(0).props().className)
      .toBe('cell-container code')
  })

  it('sets the top div with correct class if selected===true and editingCell===false', () => {
    props.selected = true
    props.editingCell = false
    expect(outputContainer().find('div').at(0).props().className)
      .toBe('cell-container code selected-cell')
  })

  it('sets the top div with correct class if selected===false and editingCell===true', () => {
    props.selected = false
    props.editingCell = true
    expect(outputContainer().find('div').at(0).props().className)
      .toBe('cell-container code editing-cell')
  })

  it('sets the top div with correct class if selected===true and editingCell===true', () => {
    props.selected = true
    props.editingCell = true
    expect(outputContainer().find('div').at(0).props().className)
      .toBe('cell-container code selected-cell editing-cell')
  })

  it('sets the onMouseDown prop to handleCellClick', () => {
    expect(outputContainer().props().onMouseDown)
      .toEqual(outputContainer().instance().handleCellClick)
  })

  it('mouse down on cell container div fires selectCell with correct props', () => {
    props.viewMode = 'editor'
    props.selected = false
    outputContainer().simulate('mousedown')
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
      outputContainer().simulate('mousedown')
      expect(selectCell.mock.calls.length).toBe(0)
    })
  })

  it('always renders one div with class cell-row-container inside top div', () => {
    expect(outputContainer().wrap(outputContainer().find('div').at(0)
      .props().children).find('div.cell-row-container')).toHaveLength(1)
  })

  it('always has a children inside the second div', () => {
    expect(outputContainer().find('div.cell-row-container')
      .props().children).toEqual(node)
  })
})

describe('OutputContainer mapStateToProps', () => {
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
