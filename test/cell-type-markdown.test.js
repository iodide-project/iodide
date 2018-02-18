import { shallow } from 'enzyme'
import React from 'react'
import { MarkdownCellUnconnected, mapStateToProps } from '../src/components/cell-type-markdown'
import CellEditor from '../src/components/cell-editor'
import CellRow from '../src/components/cell-row'
import { CellContainer } from '../src/components/cell-container'

describe('MarkdownCell_unconnected react component', () => {
  let props
  let mountedCell
  const cell = () => {
    if (!mountedCell) {
      mountedCell = shallow(<MarkdownCellUnconnected {...props} />)
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

  it('always renders one CellContainer', () => {
    expect(cell().find(CellContainer).length).toBe(1)
  })

  it("sets the CellContainer cellId prop to be the MarkdownCell's cellId prop", () => {
    expect(cell().find(CellContainer).props().cellId)
      .toBe(props.cellId)
  })

  it('the CellContainer should have two CellRow', () => {
    expect(cell().wrap(cell().find(CellContainer))
      .find(CellRow)).toHaveLength(2)
  })

  it("sets the first CellRow cellId prop to be the MarkdownCell's cellId prop", () => {
    expect(cell().find(CellRow).at(0).props().cellId)
      .toBe(props.cellId)
  })

  it('sets the first CellRow rowType prop to be input', () => {
    expect(cell().find(CellRow).at(0).props().rowType)
      .toBe('input')
  })

  it('sets the second CellRow rowType prop to be output', () => {
    expect(cell().find(CellRow).at(1).props().rowType)
      .toBe('output')
  })

  it("sets the second CellRow cellId prop to be the MarkdownCell's cellId prop", () => {
    expect(cell().find(CellRow).at(1).props().cellId)
      .toBe(props.cellId)
  })

  it('the first CellRow always has a child that is a CellEditor', () => {
    expect(cell().wrap(cell().find(CellRow).at(0)
      .props().children).find(CellEditor)).toHaveLength(1)
  })


  it('the second CellRow always has a child that is is a div', () => {
    expect(cell().wrap(cell().find(CellRow).at(1)
      .props().children).find('div')).toHaveLength(1)
  })

  it('editor shown if MD not rendered', () => {
    props.rendered = false
    props.pageMode = 'command'
    props.cellSelected = true
    expect(cell().wrap(cell().find(CellEditor)).props().containerStyle)
      .toEqual({ display: 'block' })

    expect(cell().wrap(cell().find('div')).props().style)
      .toEqual({ display: 'none' })
  })

  it('editor not shown if MD is rendered, and not editing', () => {
    props.rendered = true
    props.pageMode = 'command'
    props.cellSelected = true
    expect(cell().wrap(cell().find(CellEditor)).props().containerStyle)
      .toEqual({ display: 'none' })

    expect(cell().wrap(cell().find('div')).props().style)
      .toEqual({ display: 'block' })
  })

  it('MD shown if rendered and in command mode, whether cell selected or not', () => {
    props.rendered = true
    props.pageMode = 'command'
    props.cellSelected = true
    expect(cell().wrap(cell().find(CellEditor)).props().containerStyle)
      .toEqual({ display: 'none' })

    expect(cell().wrap(cell().find('div')).props().style)
      .toEqual({ display: 'block' })
  })

  it('MD shown if rendered and in command mode, whether cell selected or not', () => {
    props.rendered = true
    props.pageMode = 'command'
    props.cellSelected = false
    expect(cell().wrap(cell().find(CellEditor)).props().containerStyle)
      .toEqual({ display: 'none' })
    expect(cell().wrap(cell().find('div')).props().style)
      .toEqual({ display: 'block' })
  })

  it('MD shown if rendered and in command mode', () => {
    props.rendered = true
    props.pageMode = 'command'
    props.cellSelected = false
    expect(cell().wrap(cell().find(CellEditor)).props().containerStyle)
      .toEqual({ display: 'none' })
    expect(cell().wrap(cell().find('div')).props().style)
      .toEqual({ display: 'block' })
  })

  it('MD shown if rendered and in edit mode but another cell is selected', () => {
    props.rendered = true
    props.pageMode = 'edit'
    props.cellSelected = false
    expect(cell().wrap(cell().find(CellEditor)).props().containerStyle)
      .toEqual({ display: 'none' })
    expect(cell().wrap(cell().find('div')).props().style)
      .toEqual({ display: 'block' })
  })

  it('editor shown if in edit mode and cell selected', () => {
    props.rendered = true
    props.pageMode = 'edit'
    props.cellSelected = true
    expect(cell().wrap(cell().find(CellEditor)).props().containerStyle)
      .toEqual({ display: 'block' })
    expect(cell().wrap(cell().find('div')).props().style)
      .toEqual({ display: 'none' })
  })

  it('div should have dangerouslySetInnerHTML', () => {
    props.value = 'html string'
    expect(cell().wrap(cell().find('div')).props().dangerouslySetInnerHTML)
      .toEqual({ __html: props.value })
  })

  it('both the editor and output recieve enterEditMode() as props', () => {
    expect(cell().wrap(cell().find(CellEditor)).props().onContainerClick)
      .toEqual(cell().instance().enterEditMode)
    expect(cell().wrap(cell().find('div')).props().onDoubleClick)
      .toEqual(cell().instance().enterEditMode)
  })
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

//   it("always renders one OneRowCell", () => {
//     expect(cell().find(OneRowCell).length).toBe(1)
//   })
// })


describe('MarkdownCell mapStateToProps', () => {
  const state = {
    cells: [{
      id: 5,
      value: '#MD string',
      rendered: true,
      selected: true,
    },
    ],
    mode: 'edit',
    viewMode: 'presentation',
  }

  it("should return the 'rendered' of the correct cell if value is undefined", () => {
    const ownProps = { cellId: 5 }
    expect(mapStateToProps(state, ownProps))
      .toEqual({
        value: '#MD string',
        rendered: true,
        cellSelected: true,
        pageMode: 'edit',
        viewMode: 'presentation',
      })
  })
})
