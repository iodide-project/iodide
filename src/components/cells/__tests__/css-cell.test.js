import React from 'react'
import { shallow } from 'enzyme'

import {
  CSSCellUnconnected as CSSCell,
  mapStateToProps,
} from '../css-cell'
import CellEditor from '../cell-editor'
import { CellContainer } from '../cell-container'
import CellRow from '../cell-row'


describe('CSSCell_unconnected react component', () => {
  let props
  let mountedCell
  const cell = () => {
    if (!mountedCell) {
      mountedCell = shallow(<CSSCell {...props} />)
    }
    return mountedCell
  }

  beforeEach(() => {
    props = {
      cellId: 5,
      value: 'h1 {color:pink}',
      rendered: false,
    }
    mountedCell = undefined
  })

  it('always renders one CellContainer', () => {
    expect(cell().find(CellContainer).length).toBe(1)
  })

  it('always renders one CellRow inside CellContainer', () => {
    expect(cell().wrap(cell().find(CellContainer))
      .find(CellRow)).toHaveLength(1)
  })

  it('is a CellRow with two children', () => {
    expect(cell().find(CellRow).children().length).toBe(2)
  })

  it('always renders one CellEditor inside CellRow', () => {
    expect(cell().find(CellEditor).parent().is(CellRow)).toEqual(true)
  })

  it('always renders one style elt inside CellRow', () => {
    expect(cell().find('style').parent().is(CellRow)).toEqual(true)
  })

  it('the style elt has the correct value if rendered===true', () => {
    props.rendered = true
    const styleElts = cell().find('style')
    expect(styleElts.text()).toEqual('h1 {color:pink}')
  })

  it('the style elt is empty if rendered==false', () => {
    const styleElts = cell().find('style')
    expect(styleElts.text()).toEqual('')
  })

  it("sets the CellContainer cellId prop to be the CSSCell's cellId prop", () => {
    expect(cell().find(CellContainer).props().cellId)
      .toBe(props.cellId)
  })

  it("sets the CellRow cellId prop to be the CSSCell's cellId prop", () => {
    expect(cell().find(CellRow).props().cellId)
      .toBe(props.cellId)
  })

  it('sets the CellRow rowType prop to be input', () => {
    expect(cell().find(CellRow).props().rowType)
      .toBe('input')
  })

  it('sets the CellEditor cellId prop to be the CSSCell cellId input prop', () => {
    expect(cell().find(CellEditor).props().cellId)
      .toBe(props.cellId)
  })
})


describe('CSSCell mapStateToProps', () => {
  const state = {
    cells: [
      { id: 5, value: 'h1 {color:pink}', rendered: true },
      { id: 3, value: 'h1 {color:blue}', rendered: false }],
  }

  it('should return the content of the correct cells', () => {
    const ownProps = { cellId: 5 }
    expect(mapStateToProps(state, ownProps))
      .toEqual({ value: 'h1 {color:pink}', rendered: true, cellId: 5 })
  })

  it('should return the content of the correct cells', () => {
    const ownProps = { cellId: 3 }
    expect(mapStateToProps(state, ownProps))
      .toEqual({ value: 'h1 {color:blue}', rendered: false, cellId: 3 })
  })
})
