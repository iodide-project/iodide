import React from "react"
import { shallow, render, mount } from "enzyme"

import MarkdownCell, {MarkdownCellUnconnected,
  mapStateToProps} from '../src/components/cell-type-markdown.jsx'
import CellEditor from '../src/components/cell-editor.jsx'
import TwoRowCell from '../src/components/two-row-cell.jsx'

import { Provider } from 'react-redux'

import configureStore from 'redux-mock-store'



describe("MarkdownCell_unconnected react component", () => {
  let props
  let mountedCell
  const cell = () => {
    if (!mountedCell) {
      mountedCell = shallow(
        <MarkdownCellUnconnected {...props} />
      )
    }
    return mountedCell
  }

  beforeEach(() => {
    props = {
      cellId: 1,
      value: 'a _markdown_ string',
      rendered: true,
      cellSelected: false,
      pageMode: 'command',
      viewMode: 'editor',
    }
    mountedCell = undefined
  })

  it("always renders one TwoRowCell", () => {
    expect(cell().find(TwoRowCell).length).toBe(1)
  })

  it("sets the TwoRowCell cellId prop to be the MarkdownCell's cellId prop", () => {
    expect(cell().find(TwoRowCell).props().cellId)
      .toBe(props.cellId)
  })

  it("the TwoRowCell always has a row1 prop that is a CellEditor", () => {
    expect(cell().wrap(cell().find(TwoRowCell)
      .props().row1).find(CellEditor)).toHaveLength(1)
  })

  it("sets the CellEditor cellId prop to be the MarkdownCell's cellId prop", () => {
    expect(cell().wrap(cell().find(TwoRowCell)
        .props().row1).props().cellId)
      .toBe(props.cellId)
  })

  it("the TwoRowCell always has a row2 prop that is a div", () => {
    expect(cell().wrap(cell().find(TwoRowCell)
      .props().row2).find("div")).toHaveLength(1)
  })

  it("editor shown if MD not rendered", () => {
    props.rendered = false
    props.pageMode = 'command'
    props.cellSelected = true
    
    expect(cell().wrap(cell().find(TwoRowCell)
        .props().row1).props().containerStyle)
      .toEqual({display: 'block'})

    expect(cell().wrap(cell().find(TwoRowCell)
        .props().row2).props().style)
      .toEqual({display: 'none'})
  })

  it("MD shown if rendered and in command mode", () => {
    props.rendered = true
    props.pageMode = 'command'
    props.cellSelected = true
    
    expect(cell().wrap(cell().find(TwoRowCell)
        .props().row1).props().containerStyle)
      .toEqual({display: 'none'})

    expect(cell().wrap(cell().find(TwoRowCell)
        .props().row2).props().style)
      .toEqual({display: 'block'})
  })

  it("MD shown if rendered and in command mode", () => {
    props.rendered = true
    props.pageMode = 'command'
    props.cellSelected = false
    
    expect(cell().wrap(cell().find(TwoRowCell)
        .props().row1).props().containerStyle)
      .toEqual({display: 'none'})

    expect(cell().wrap(cell().find(TwoRowCell)
        .props().row2).props().style)
      .toEqual({display: 'block'})
  })

  it("MD shown if rendered and in edit mode but another cell is selected", () => {
    props.rendered = true
    props.pageMode = 'edit'
    props.cellSelected = false
    
    expect(cell().wrap(cell().find(TwoRowCell)
        .props().row1).props().containerStyle)
      .toEqual({display: 'none'})

    expect(cell().wrap(cell().find(TwoRowCell)
        .props().row2).props().style)
      .toEqual({display: 'block'})
  })

  it("editor shown if in edit mode and cell selected", () => {
    props.rendered = true
    props.pageMode = 'edit'
    props.cellSelected = true
    
    expect(cell().wrap(cell().find(TwoRowCell)
        .props().row1).props().containerStyle)
      .toEqual({display: 'block'})

    expect(cell().wrap(cell().find(TwoRowCell)
        .props().row2).props().style)
      .toEqual({display: 'none'})
  })

  // it("both the editor and output recieve enterEditMode() as props", () => {
  //   expect(cell().wrap(cell().find(TwoRowCell)
  //       .props().row1).props().onContainerClick)
  //     .toEqual(cell().enterEditMode)

  //   expect(cell().wrap(cell().find(TwoRowCell)
  //       .props().row2).props().onDoubleClick)
  //     .toEqual(cell().enterEditMode)
  // })

})


// import {store} from '../src/store.js'
// import {newNotebook} from '../src/state-prototypes.js'

// // render(
// //   <Provider store={store}>
// //     <Page />
// //   </Provider>

// // const mockStore = configureStore()
// // const initialState = newNotebook()
// // const store = mockStore(initialState);

// describe("MarkdownCell connected component actions integration test", () => {
//   let props
//   let mountedCell
//   const cell = () => {
//     if (!mountedCell) {
//       mountedCell = mount(
//         <Provider store={store}>
//           <MarkdownCell {...props} />
//         </Provider>
//       ,{context: {store}})
//     }
//     return mountedCell
//   }

//   beforeEach(() => {
//     props = {
//       cellId: 1,
//       value: 'a _markdown_ string',
//       rendered: true,
//       cellSelected: false,
//       pageMode: 'command',
//       viewMode: 'editor',
//     }
//     mountedCell = undefined
//   })

//   it("always renders one TwoRowCell", () => {
//     expect(cell().find(TwoRowCell).length).toBe(1)
//   })
// })



describe("MarkdownCell mapStateToProps", () => {
  const state = {cells:[{
    id: 5,
    value: "#MD string",
    rendered: true,
    selected: true,},
    ],
    mode: "edit",
    viewMode: "presentation"
  }

  it("should return the 'rendered' of the correct cell if value is undefined", () => {
    let ownProps = {cellId:5}
    expect(mapStateToProps(state, ownProps))
      .toEqual({
      value: "#MD string",
      rendered: true,
      cellSelected: true,
      pageMode: 'edit',
      viewMode: 'presentation',
    })
  })
})