import { shallow } from 'enzyme'
import React from 'react'

import { CellContainerUnconnected, mapStateToProps } from '../cell-container'
import CellMenuContainer from '../cell-menu-container'
import CellEditor from '../cell-editor'

describe('CellContainerUnconnected React component', () => {
  let selectCell
  let updateCellProperties
  let highlightCell
  let unHighlightCells
  let multipleCellHighlight
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
    updateCellProperties = jest.fn()
    highlightCell = jest.fn()
    unHighlightCells = jest.fn()
    multipleCellHighlight = jest.fn()
    props = {
      cellId: 1,
      cellContainerStyle: {
        outline: 'CONTAINER_OUTLINE_TEST_STRING',
        background: 'CONTAINER_BACKGROUND_TEST_STRING',
      },
      mainComponentStyle: {
        outline: 'MAIN_COMPONENT_OUTLINE_TEST_STRING',
        display: 'MAIN_COMPONENT_DISPLAY_TEST_STRING',
      },
      mainComponentClass: 'MAIN_COMPONENT_CLASS_TEST_STRING',
      selected: true,
      nextInputFolding: 'VISIBLE',
      // action props
      selectCell,
      updateCellProperties,
      highlightCell,
      unHighlightCells,
      multipleCellHighlight,
    }
    mountedCont = undefined
  })

  it('always renders two div', () => {
    expect(cellContainer().find('div').length).toBe(3)
  })

  it('always renders two children inside top div', () => {
    expect(cellContainer().find('div').at(0).children()
      .length).toBe(2)
  })

  it('sets the top div to have id cell-1', () => {
    expect(cellContainer().find('div').at(0).props().id)
      .toBe('cell-1')
  })

  it('sets the top div with correct class', () => {
    expect(cellContainer().find('div').at(0).props().className)
      .toBe('cell-container')
  })

  it('sets the onMouseDown prop to handleCellClick', () => {
    expect(cellContainer().props().onMouseDown)
      .toEqual(cellContainer().instance().handleCellClick)
  })

  it('mouse down on cell container div fires selectCell with correct props', () => {
    props.viewMode = 'editor'
    props.selected = false
    cellContainer().simulate('mousedown', {
      ctrlKey: false,
      metaKey: false,
      target: document.createElement('mockElement'),
    })
    expect(selectCell.mock.calls.length).toBe(1)
    expect(selectCell.mock.calls[0].length).toBe(2)
  })

  it('mouse down on cell container div fires unHighlightCells with correct props', () => {
    props.viewMode = 'editor'
    props.highlighted = true
    cellContainer().simulate('mousedown', {
      ctrlKey: false,
      metaKey: false,
      target: document.createElement('mockElement'),
    })
    expect(unHighlightCells.mock.calls.length).toBe(1)
    expect(unHighlightCells.mock.calls[0].length).toBe(0)
  })

  it('mouse down on cell container fires multipleCellHighlight with Shift press', () => {
    props.viewMode = 'editor'
    cellContainer().simulate('mousedown', {
      shiftKey: true,
      ctrlKey: true,
      metaKey: false,
      target: document.createElement('mockElement'),
      preventDefault: () => {
      },
    })
    expect(multipleCellHighlight.mock.calls.length).toBe(1)
    expect(multipleCellHighlight.mock.calls[0].length).toBe(1)
  })

  it('mouse down on cell container fires highlightCell with correct props and Ctrl press', () => {
    props.viewMode = 'editor'
    cellContainer().simulate('mousedown', {
      ctrlKey: true,
      metaKey: false,
      target: document.createElement('mockElement'),
    })
    expect(highlightCell.mock.calls.length).toBe(1)
    expect(highlightCell.mock.calls[0].length).toBe(1)
  })

  it('always renders one CellMenuContainer inside top div', () => {
    expect(cellContainer().find('div').at(0)
      .find(CellMenuContainer)).toHaveLength(1)
  })

  it("sets the CellMenuContainer cellId prop to be the CellContainer's cellId prop", () => {
    expect(cellContainer().find(CellMenuContainer).props().cellId)
      .toBe(props.cellId)
  })

  it('contains one CellEditor', () => {
    expect(cellContainer().find(CellEditor)).toHaveLength(1)
  })

  it('CellEditor gets correct props', () => {
    expect(cellContainer().find(CellEditor).props().cellId).toEqual(props.cellId)
  })
})


describe('CellContainer mapStateToProps', () => {
  let state
  let ownProps

  beforeEach(() => {
    state = {
      mode: 'EDIT_MODE',
      cells: [{ id: 5, selected: true, inputFolding: 'VISIBLE' }],
    }
    ownProps = { cellId: 5 }
  })

  const stateToContainerStylesMappings = [
    {
      state: {
        cells: [{
          id: 5,
          highlighted: false,
          selected: true,
          inputFolding: 'VISIBLE',
        }],
        mode: 'EDIT_MODE',
      },
      style: { outline: 'solid #bbb 1px', background: 'none' },
    },
    {
      state: {
        cells: [{
          id: 5,
          highlighted: true,
          selected: false,
          inputFolding: 'VISIBLE',
        }],
        mode: 'EDI_MODE',
      },
      style: { outline: 'solid #f1f1f1 1px', background: 'rgba(116, 185, 255, 0.2)' },
    },
    {
      state: {
        cells: [{
          id: 5,
          highlighted: false,
          selected: true,
          inputFolding: 'VISIBLE',
        }],
        mode: 'COMMAND_MODE',
      },
      style: { outline: 'solid #bbb 2px', background: 'none' },
    },
    {
      state: {
        cells: [{
          id: 5,
          highlighted: false,
          selected: false,
          inputFolding: 'VISIBLE',
        }],
        mode: 'COMMAND_MODE',
      },
      style: { outline: 'solid #f1f1f1 1px', background: 'none' },
    },
  ]
  stateToContainerStylesMappings.forEach((testCase, i) => {
    it(`cell container should get correct styles, case index ${i}`, () => {
      expect(mapStateToProps(testCase.state, ownProps).cellContainerStyle)
        .toEqual(testCase.style)
    })
  })

  const stateToMainComponentOutlineMappings = [
    {
      state: {
        cells: [{ id: 5, selected: true, inputFolding: 'VISIBLE' }],
        mode: 'EDIT_MODE',
      },
      style: { outline: '1px solid #bbb' },
    },
    {
      state: {
        cells: [{ id: 5, selected: false, inputFolding: 'VISIBLE' }],
        mode: 'EDIT_MODE',
      },
      style: { outline: '1px solid #f1f1f1' },
    },
    {
      state: {
        cells: [{ id: 5, selected: true, inputFolding: 'VISIBLE' }],
        mode: 'COMMAND_MODE',
      },
      style: { outline: '1px solid #f1f1f1' },
    },
    {
      state: {
        cells: [{ id: 5, selected: false, inputFolding: 'VISIBLE' }],
        mode: 'COMMAND_MODE',
      },
      style: { outline: '1px solid #f1f1f1' },
    },
  ]
  stateToMainComponentOutlineMappings.forEach((testCase, i) => {
    it(`cell container should get correct styles, case index ${i}`, () => {
      expect(mapStateToProps(testCase.state, ownProps).mainComponentStyle.outline)
        .toEqual(testCase.style.outline)
    })
  })

  const stateToMainComponentDisplayMappings = [
    {
      state: {
        cells: [{ id: 5, selected: true, inputFolding: 'HIDDEN' }],
        mode: 'EDIT_MODE',
      },
      style: { display: 'none' },
    },
    {
      state: {
        cells: [{ id: 5, selected: false, inputFolding: 'ANYTHING_NOT_HIDDED' }],
        mode: 'EDIT_MODE',
      },
      style: { display: 'block' },
    },
  ]
  stateToMainComponentDisplayMappings.forEach((testCase, i) => {
    it(`cell container should get correct styles, case index ${i}`, () => {
      expect(mapStateToProps(testCase.state, ownProps).mainComponentStyle.display)
        .toEqual(testCase.style.display)
    })
  })

  it('mainComponentClass correctly passes through inputFolding', () => {
    state.cells[0].inputFolding = 'TEST_STRING'
    expect(mapStateToProps(state, ownProps).mainComponentClass)
      .toEqual('main-component TEST_STRING')
  })

  it('mainComponentClass correctly passes through inputFolding', () => {
    expect(mapStateToProps(state, ownProps).mainComponentClass)
      .toEqual('main-component VISIBLE')
  })

  it('correctly passes through nextInputFolding', () => {
    state.cells[0].inputFolding = 'HIDDEN'
    expect(mapStateToProps(state, ownProps).nextInputFolding)
      .toEqual('VISIBLE')
    state.cells[0].inputFolding = 'VISIBLE'
    expect(mapStateToProps(state, ownProps).nextInputFolding)
      .toEqual('SCROLL')
    state.cells[0].inputFolding = 'SCROLL'
    expect(mapStateToProps(state, ownProps).nextInputFolding)
      .toEqual('HIDDEN')
  })
})
