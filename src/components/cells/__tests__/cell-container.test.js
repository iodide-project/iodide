import { shallow } from 'enzyme'
import React from 'react'

import { CellContainerUnconnected, mapStateToProps } from '../cell-container'
import CellMenuContainer from '../cell-menu-container'
import CellEditor from '../cell-editor'

describe('CellContainerUnconnected React component', () => {
  let selectCell
  let updateCellProperties
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
    props = {
      cellId: 1,
      cellContainerStyle: { outline: 'CONTAINER_OUTLINE_TEST_STRING' },
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

  it('mousedown on cell container div fires selectCell with cell not selected', () => {
    props.selected = false
    cellContainer().simulate('mousedown')
    expect(selectCell.mock.calls.length).toBe(1)
    expect(selectCell.mock.calls[0].length).toBe(2)
  })

  it('mousedown on cell container div DOES NOT fires selectCell if cell is selected', () => {
    props.selected = true
    cellContainer().simulate('mousedown')
    expect(selectCell.mock.calls.length).toBe(0)
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
      cells: [{ id: 5, selected: true, inputFolding: 'VISIBLE' }],
      mode: 'edit',
    }
    ownProps = { cellId: 5 }
  })

  const stateToContainerStylesMappings = [
    {
      state: {
        cells: [{ id: 5, selected: true, inputFolding: 'VISIBLE' }],
        mode: 'edit',
      },
      style: { outline: 'solid #bbb 1px' },
    },
    {
      state: {
        cells: [{ id: 5, selected: false, inputFolding: 'VISIBLE' }],
        mode: 'edit',
      },
      style: { outline: 'solid #f1f1f1 1px' },
    },
    {
      state: {
        cells: [{ id: 5, selected: true, inputFolding: 'VISIBLE' }],
        mode: 'command',
      },
      style: { outline: 'solid #bbb 2px' },
    },
    {
      state: {
        cells: [{ id: 5, selected: false, inputFolding: 'VISIBLE' }],
        mode: 'command',
      },
      style: { outline: 'solid #f1f1f1 1px' },
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
        mode: 'edit',
      },
      style: { outline: '1px solid #bbb' },
    },
    {
      state: {
        cells: [{ id: 5, selected: false, inputFolding: 'VISIBLE' }],
        mode: 'edit',
      },
      style: { outline: '1px solid #f1f1f1' },
    },
    {
      state: {
        cells: [{ id: 5, selected: true, inputFolding: 'VISIBLE' }],
        mode: 'command',
      },
      style: { outline: '1px solid #f1f1f1' },
    },
    {
      state: {
        cells: [{ id: 5, selected: false, inputFolding: 'VISIBLE' }],
        mode: 'command',
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
        mode: 'edit',
      },
      style: { display: 'none' },
    },
    {
      state: {
        cells: [{ id: 5, selected: false, inputFolding: 'ANYTHING_NOT_HIDDED' }],
        mode: 'edit',
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
