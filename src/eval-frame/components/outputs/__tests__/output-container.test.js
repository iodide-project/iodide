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
      selected: true,
      cellId: 1,
      editingCell: true,
      viewMode: 'EXPLORE_VIEW',
      cellType: 'code',
      value: 10,
      postMessageToEditor: postMessageToEditorMock,
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
      .toBe('no-output cell-container code')
  })

  it('sets the top div with correct class if selected===true and editingCell===false', () => {
    props.selected = true
    props.editingCell = false
    expect(outputContainer().find('div').at(0).props().className)
      .toBe('no-output cell-container code selected-cell')
  })

  it('sets the top div with correct class if selected===false and editingCell===true', () => {
    props.selected = false
    props.editingCell = true
    expect(outputContainer().find('div').at(0).props().className)
      .toBe('no-output cell-container code editing-cell')
  })

  it('sets the top div with correct class if selected===true and editingCell===true', () => {
    props.selected = true
    props.editingCell = true
    expect(outputContainer().find('div').at(0).props().className)
      .toBe('no-output cell-container code selected-cell editing-cell')
  })

  it('sets the onMouseDown prop to handleCellClick', () => {
    expect(outputContainer().props().onMouseDown)
      .toEqual(outputContainer().instance().handleCellClick)
  })

  it('mouse down on cell container div fires postMessageToEditor with correct props', () => {
    // const spy = jest.spyOn(global.MessageChannel.prototype.port1, 'postMessage')
    props.viewMode = 'EXPLORE_VIEW'
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

  const postMessageToEditorNotFiredVariants = [
    { selected: true, viewMode: 'EXPLORE_VIEW' },
    { selected: false, viewMode: 'REPORT_VIEW' },
    { selected: true, viewMode: 'REPORT_VIEW' },
  ]

  postMessageToEditorNotFiredVariants.forEach((state) => {
    it('click on cell container div does not fire postMessageToEditor with incorrect props', () => {
      props.viewMode = state.viewMode
      props.selected = state.selected
      outputContainer().simulate('mousedown')
      expect(postMessageToEditorMock.mock.calls.length).toBe(0)
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

// *********************** map state to props

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
      viewMode: 'EXPLORE_VIEW',
    }
  })

  it('should return the basic info for the correct cell', () => {
    const ownProps = { cellId: 5 }
    expect(mapStateToProps(state, ownProps))
      .toEqual({
        cellId: 5,
        selected: true,
        editingCell: true,
        viewMode: 'EXPLORE_VIEW',
        cellType: 'code',
        outputHasValue: false,
        postMessageToEditor,
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
        viewMode: 'EXPLORE_VIEW',
        cellType: 'code',
        outputHasValue: false,
        postMessageToEditor,
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
        viewMode: 'EXPLORE_VIEW',
        outputHasValue: false,
        cellType: 'code',
        postMessageToEditor,
      })
  })

  it('should return editingCell as false if selected===false and mode===not_edit', () => {
    const ownProps = { cellId: 5 }
    state.mode = 'not_edit'
    state.cells[0].selected = false
    state.cells[0].value = 100000
    expect(mapStateToProps(state, ownProps))
      .toEqual({
        cellId: 5,
        selected: false,
        editingCell: false,
        viewMode: 'EXPLORE_VIEW',
        outputHasValue: true,
        cellType: 'code',
        postMessageToEditor,
      })
  })
})
