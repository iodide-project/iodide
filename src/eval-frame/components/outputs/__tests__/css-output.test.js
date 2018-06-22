import React from 'react'
import { shallow } from 'enzyme'

import {
  CSSOutputUnconnected as CSSOutput,
  mapStateToProps,
} from '../css-output'
import { OutputContainer } from '../output-container'
import OutputRow from '../output-row'


describe('CSSOutput_unconnected react component', () => {
  let props
  let mountedCell
  const output = () => {
    if (!mountedCell) {
      mountedCell = shallow(<CSSOutput {...props} />)
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

  it('always renders one OutputContainer', () => {
    expect(output().find(OutputContainer).length).toBe(1)
  })

  it('always renders one OutputRow inside OutputContainer', () => {
    expect(output().wrap(output().find(OutputContainer))
      .find(OutputRow)).toHaveLength(1)
  })

  it('is a OutputRow with 1 children', () => {
    expect(output().find(OutputRow).children().length).toBe(1)
  })

  it('always renders one style elt inside OutputRow', () => {
    expect(output().find('style').parent().is(OutputRow)).toEqual(true)
  })

  it('the style elt has the correct value if rendered===true', () => {
    props.rendered = true
    const styleElts = output().find('style')
    expect(styleElts.text()).toEqual('h1 {color:pink}')
  })

  it('the style elt is empty if rendered==false', () => {
    const styleElts = output().find('style')
    expect(styleElts.text()).toEqual('')
  })

  it("sets the OutputContainer cellId prop to be the CSSOutput's cellId prop", () => {
    expect(output().find(OutputContainer).props().cellId)
      .toBe(props.cellId)
  })

  it("sets the OutputRow cellId prop to be the CSSOutput's cellId prop", () => {
    expect(output().find(OutputRow).props().cellId)
      .toBe(props.cellId)
  })

  it('sets the OutputRow rowType prop to be input', () => {
    expect(output().find(OutputRow).props().rowType)
      .toBe('input')
  })
})


describe('CSSOutput mapStateToProps', () => {
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
