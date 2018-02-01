import React from "react"
import { shallow, render } from "enzyme"

import JavascriptCell, {JsCell_unconnected as JsCell,
  mapStateToProps} from '../src/components/cell-type-javascript.jsx'
import CellEditor from '../src/components/cell-editor.jsx'
import TwoRowCell from '../src/components/two-row-cell.jsx'
import CellOutput from '../src/components/output.jsx'


import { Provider } from 'react-redux'


import configureStore from 'redux-mock-store'
const mockStore = configureStore()

describe("JsCell_unconnected react component", () => {
  let props
  let mountedCell
  const cell = () => {
    if (!mountedCell) {
      mountedCell = shallow(
        <JsCell {...props} />
      )
    }
    return mountedCell
  }

  beforeEach(() => {
    props = {
      cellId: 5,
      value: 3.1415,
      rendered: true,
    }
    mountedCell = undefined
  })

  it("always renders one TwoRowCell", () => {
    expect(cell().find(TwoRowCell).length).toBe(1)
  })

  it("sets the TwoRowCell cellId prop to be the JsCell's cellId prop", () => {
    expect(cell().find(TwoRowCell).props().cellId)
      .toBe(props.cellId)
  })

  it("the TwoRowCell always has a row1 prop that is a CellEditor", () => {
    expect(cell().wrap(cell().find(TwoRowCell)
      .props().row1).find(CellEditor)).toHaveLength(1)
  })

  it("sets the CellEditor cellId prop to be the JsCell's cellId prop", () => {
    expect(cell().wrap(cell().find(TwoRowCell)
        .props().row1).props().cellId)
      .toBe(props.cellId)
  })

  it("the TwoRowCell always has a row2 prop that is a CellOutput", () => {
    expect(cell().wrap(cell().find(TwoRowCell)
      .props().row2).find(CellOutput)).toHaveLength(1)
  })

  it("sets the CellOutput valueToRender prop to be the JsCell's value prop", () => {
    expect(cell().wrap(cell().find(TwoRowCell)
        .props().row2).props().valueToRender)
      .toBe(props.value)
  })

  it("sets the CellOutput renderValue prop to be the JsCell's value prop", () => {
    expect(cell().wrap(cell().find(TwoRowCell)
        .props().row2).props().renderValue)
      .toBe(props.rendered)
  })

})




describe("JsCell mapStateToProps", () => {
  const state = {cells:[
    {id:5, rendered: false},
    {id:3, value:3.14, rendered: true}]}

  it("should return the 'rendered' of the correct cell if value is undefined", () => {
    let ownProps = {cellId:5}
    expect(mapStateToProps(state, ownProps))
      .toEqual({rendered: false})
  })

  it("should return 'rendered' and 'value' of the correct cells", () => {
    let ownProps = {cellId:3}
    expect(mapStateToProps(state, ownProps))
      .toEqual({value:3.14, rendered: true})
  })

})