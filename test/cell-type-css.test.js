import React from "react"
import { shallow } from "enzyme"

import {CSSCell_unconnected as CSSCell,
  mapStateToProps} from '../src/components/cell-type-css.jsx'
import CellEditor from '../src/components/cell-editor.jsx'
import OneRowCell from '../src/components/one-row-cell.jsx'



describe("CSSCell_unconnected react component", () => {
  let props
  let mountedCell
  const cell = () => {
    if (!mountedCell) {
      mountedCell = shallow(
        <CSSCell {...props} />
      )
    }
    return mountedCell
  }

  beforeEach(() => {
    props = {
      cellId: 5,
      content: 'h1 {color:pink}'
    }
    mountedCell = undefined
  })

  it("always renders one style elt", () => {
    const styleElts = cell().find("style")
    expect(styleElts.length).toBe(1)
  })

  it("the style elt has the correct content", () => {
    const styleElts = cell().find("style")
    expect(styleElts.text()).toEqual('h1 {color:pink}')
  })

  it("always renders one CellEditor", () => {
    expect(cell().find(CellEditor).length).toBe(1)
  })

  it("always renders one OneRowCell", () => {
    expect(cell().find(OneRowCell).length).toBe(1)
  })

  it("is a OneRowCell with two children", () => {
    expect(cell().find(OneRowCell).children().length).toBe(2)
  })
})



describe("CSSCell mapStateToProps", () => {
  const state = {cells:[
    {id:5, content:'h1 {color:pink}'},
    {id:3, content:'h1 {color:blue}'}]}

  it("should return the content of the correct cells", () => {
    let ownProps = {cellId:5}
    expect(mapStateToProps(state, ownProps))
      .toEqual({content:'h1 {color:pink}'})
  })
})