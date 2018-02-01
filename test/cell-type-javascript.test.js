import React from "react"
import { shallow, render } from "enzyme"

import JavascriptCell, {JsCell_unconnected as JsCell,
  mapStateToProps} from '../src/components/cell-type-javascript.jsx'
import CellEditor from '../src/components/cell-editor.jsx'
import TwoRowCell from '../src/components/two-row-cell.jsx'

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
})



// describe("JsCell connected react component", () => {
//   let ownProps, store
//   let mountedCell
//   const initialState = {cells:[
//     {id:5, rendered: false},
//     {id:3, value:3.14, rendered: true}]}
//   const cell = () => {
//     if (!mountedCell) {
//       mountedCell = mount(
//         <Provider store={store}>
//           <JavascriptCell {...ownProps} />
//         </Provider>
//       )
//     }
//     return mountedCell
//   }
//   beforeEach(() => {
//     store = mockStore(initialState)
//     ownProps = {
//       cellId: 5,
//     }
//     mountedCell = undefined
//   })

//   it("always renders one TwoRowCell", () => {
//     expect(cell().find(TwoRowCell).length).toBe(1)
//   })
// })



describe("JsCell mapStateToProps", () => {
  const state = {cells:[
    {id:5, rendered: false},
    {id:3, value:3.14, rendered: true}]}

  it("should return the content of the correct cells", () => {
    let ownProps = {cellId:5}
    expect(mapStateToProps(state, ownProps))
      .toEqual({rendered: false})
  })

  it("should return the content of the correct cells", () => {
    let ownProps = {cellId:3}
    expect(mapStateToProps(state, ownProps))
      .toEqual({value:3.14, rendered: true})
  })

})