import React from 'react'
import { shallow } from 'enzyme'

import { CodeCellUnconnected as CodeCell,
  mapStateToProps } from '../src/components/cell-type-code'
import { CellContainer } from '../src/components/cell-container'
import CellRow from '../src/components/cell-row'
import CellEditor from '../src/components/cell-editor'
import CellOutput from '../src/components/output'

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
      value: 3.1415,
      rendered: true,
      language: 'js',
    }
    mountedCell = undefined
  })

  it('always renders one CellContainer', () => {
    expect(cell().find(CellContainer).length).toBe(1)
  })

  it('always renders two CellRow inside CellContainer', () => {
    expect(cell().wrap(cell().find(CellContainer))
      .find(CellRow)).toHaveLength(3)
  })

  it('always renders one CellEditor inside first CellRow', () => {
    expect(cell().wrap(cell().find(CellRow).at(0))
      .find(CellEditor)).toHaveLength(1)
  })

  it('always renders one div inside second CellRow', () => {
    expect(cell().wrap(cell().find(CellRow).at(1))
      .find('div')).toHaveLength(1)
  })

  it('always renders one CellOutput inside third CellRow', () => {
    expect(cell().wrap(cell().find(CellRow).at(2))
      .find(CellOutput)).toHaveLength(1)
  })

  it("sets the CellContainer cellId prop to be the CodeCell's cellId prop", () => {
    expect(cell().find(CellContainer).props().cellId)
      .toBe(props.cellId)
  })

  it("sets the first CellRow cellId prop to be the CodeCell's cellId prop", () => {
    expect(cell().find(CellRow).at(0).props().cellId)
      .toBe(props.cellId)
  })

  it('sets the first CellRow rowType prop to be input', () => {
    expect(cell().find(CellRow).at(0).props().rowType)
      .toBe('input')
  })

  it("sets the 2nd CellRow cellId prop to be the CodeCell's cellId prop", () => {
    expect(cell().find(CellRow).at(1).props().cellId)
      .toBe(props.cellId)
  })

  it('sets the second CellRow rowType prop to be sideeffect', () => {
    expect(cell().find(CellRow).at(1).props().rowType)
      .toBe('sideeffect')
  })

  it('sets the div in the sideeffect row to have class side-effect-target', () => {
    expect(cell().find('div').props().className)
      .toBe('side-effect-target')
  })

  it("sets the third CellRow cellId prop to be the JsCell's cellId prop", () => {
    expect(cell().find(CellRow).at(2).props().cellId)
      .toBe(props.cellId)
  })

  it('sets the third CellRow rowType prop to be output', () => {
    expect(cell().find(CellRow).at(2).props().rowType)
      .toBe('output')
  })

  it("sets the CellEditor cellId prop to be the CodeCell's cellId prop", () => {
    expect(cell().find(CellEditor).props().cellId)
      .toBe(props.cellId)
  })

  it("sets the CellOutput valueToRender prop to be the CodeCell's value prop", () => {
    expect(cell().find(CellOutput).props().valueToRender)
      .toBe(props.value)
  })

  it("sets the CellOutput renderValue prop to be the CodeCell's value prop", () => {
    expect(cell().find(CellOutput).props().render)
      .toBe(props.rendered)
  })
})


describe('CodeCell mapStateToProps', () => {
  const state = {
    cells: [
      { id: 5, rendered: false },
      { id: 3, value: 3.14, rendered: true }],
  }

  it("should return the 'rendered' of the correct cell if value is undefined", () => {
    const ownProps = { cellId: 5 }
    expect(mapStateToProps(state, ownProps))
      .toEqual({ rendered: false })
  })

  it("should return 'rendered' and 'value' of the correct cells", () => {
    const ownProps = { cellId: 3 }
    expect(mapStateToProps(state, ownProps))
      .toEqual({ value: 3.14, rendered: true })
  })
})
