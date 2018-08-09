import { shallow } from 'enzyme'
import React from 'react'

import { OutputContainerUnconnected, mapStateToProps } from '../output-container'

describe('OutputContainerUnconnected React component', () => {
  let postMessageToEditorMock
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
    postMessageToEditorMock = jest.fn()
    props = {
      cellId: 1,
      selected: true,
      postMessageToEditor: postMessageToEditorMock,
      cellContainerClass: 'testing class string',
    }
    mc = undefined
  })

  it('sets the onMouseDown prop to handleCellClick', () => {
    expect(outputContainer().props().onMouseDown)
      .toEqual(outputContainer().instance().handleCellClick)
  })

  it('mouse down on cell container div fires postMessageToEditor with correct props', () => {
    // const spy = jest.spyOn(global.MessageChannel.prototype.port1, 'postMessage')
    props.selected = false
    outputContainer().simulate('mousedown')
    // expect(spy).toHaveBeenCalled()
    expect(postMessageToEditorMock.mock.calls.length).toBe(1)
    expect(postMessageToEditorMock.mock.calls[0][0]).toEqual(
      'CLICK_ON_OUTPUT',
      {
        id: 1,
        pxFromViewportTop: 100,
      },
    )
  })

  it('click on cell container does NOT fire postMessageToEditor if cell already selected', () => {
    props.selected = true
    outputContainer().simulate('mousedown')
    expect(postMessageToEditorMock.mock.calls.length).toBe(0)
  })
})


// *********************** map state to props


describe('OutputContainer mapStateToProps', () => {
  let state

  beforeEach(() => {
    state = {
      cells: [{
        id: 5,
        selected: true,
        cellType: 'code',
        rendered: true,
        hasSideEffect: true,
      },
      ],
      mode: 'EDIT_MODE',
      viewMode: 'EXPLORE_VIEW',
    }
  })

  const cellPropsToClassNameTestCases = [
    {
      cellProps: { cellType: 'code', selected: true, rendered: true },
      className: 'cell-container code selected-cell evaluated',
    },
    {
      cellProps: { cellType: 'code', selected: true, rendered: false },
      className: 'cell-container code selected-cell not-evaluated',
    },
    {
      cellProps: { cellType: 'code', selected: false, rendered: true },
      className: 'cell-container code evaluated',
    },
    {
      cellProps: { cellType: 'code', selected: false, rendered: false },
      className: 'cell-container code not-evaluated',
    },
  ]

  cellPropsToClassNameTestCases.forEach((testCase, i) => {
    it(`should return the correct container class (case index ${i})`, () => {
      state.cells[0] = Object.assign(state.cells[0], testCase.cellProps)
      const ownProps = { cellId: 5 }
      expect(mapStateToProps(state, ownProps).cellContainerClass)
        .toEqual(testCase.className)
    })
  })

  const cellPropsToStyleTestCases = [
    {
      cellProps: { cellType: 'code', hasSideEffect: true },
      style: { display: undefined },
    },
    {
      cellProps: { cellType: 'code', hasSideEffect: false },
      style: { display: 'none' },
    },
    {
      cellProps: { cellType: 'NOT_code', hasSideEffect: true },
      style: { display: undefined },
    },
    {
      cellProps: { cellType: 'NOT_code', hasSideEffect: false },
      style: { display: undefined },
    },
  ]

  cellPropsToStyleTestCases.forEach((testCase, i) => {
    it(`should return the style (case index ${i})`, () => {
      state.cells[0] = Object.assign(state.cells[0], testCase.cellProps)
      const ownProps = { cellId: 5 }
      expect(mapStateToProps(state, ownProps).style)
        .toEqual(testCase.style)
    })
  })
})
