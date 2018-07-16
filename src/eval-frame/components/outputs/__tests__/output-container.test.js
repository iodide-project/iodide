import { shallow } from 'enzyme'
import React from 'react'

import { OutputContainerUnconnected, mapStateToProps } from '../output-container'
import { postMessageToEditor } from '../../../port-to-editor'

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

  it('sets the top div with correct class', () => {
    props.selected = false
    props.editingCell = false
    expect(outputContainer().find('div').at(0).props().className)
      .toBe('testing class string')
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

  it('always renders one div with class cell-row-container inside top div', () => {
    expect(outputContainer().wrap(outputContainer().find('div').at(0)
      .props().children).find('div.cell-row-container')).toHaveLength(1)
  })

  it('always has a children inside the second div', () => {
    expect(outputContainer().find('div.cell-row-container')
      .props().children).toEqual(node)
  })
})


// *********************** map state to props


describe('OutputContainer mapStateToProps', () => {
  let state
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

  beforeEach(() => {
    state = {
      cells: [{
        id: 5,
        selected: true,
        cellType: 'code',
        rendered: true,
      },
      ],
      mode: 'edit',
      viewMode: 'EXPLORE_VIEW',
    }
  })

  cellPropsToClassNameTestCases.forEach((testCase, i) => {
    it(`should return the correct container class (case index ${i})`, () => {
      state.cells[0] = Object.assign(state.cells[0], testCase.cellProps)
      const ownProps = { cellId: 5 }
      expect(mapStateToProps(state, ownProps))
        .toEqual({
          cellId: 5,
          selected: testCase.cellProps.selected,
          postMessageToEditor,
          cellContainerClass: testCase.className,
        })
    })
  })
})
