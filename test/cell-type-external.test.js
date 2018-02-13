import React from 'react'
import { shallow, render } from 'enzyme'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

import { ExternalResourceCellUnconnected as ExternalResourceCell,
  mapStateToProps } from '../src/components/cell-type-external-resource.jsx'
import CellEditor from '../src/components/cell-editor.jsx'
import TwoRowCell from '../src/components/two-row-cell.jsx'
import ExternalResourceOutput from '../src/components/output-handler-external-resource.jsx'

const mockStore = configureStore()

const STANDARD_NETWORK_ERROR = 'A network error occurred.'

describe('ExternalResourceCellUnconnected contains the expected child components', () => {
  let props
  let mountedCell
  const cell = () => {
    if (!mountedCell) {
      mountedCell = shallow(<ExternalResourceCell {...props} />)
    }
    return mountedCell
  }

  beforeEach(() => {
    props = {
      cellId: 5,
      value: [
        {
          src: 'http://whatever.com/cdn/a-library.js',
          status: 'loaded',
          variables: ['a', 'b', 'c'],
        },
        {
          src: 'http://whatever.com/cdn/a-stylsheet.css',
          status: 'loaded',
        },
        {
          src: 'http://whatever.com/cdn/some-other-library.js',
          status: 'error',
          statusExplanation: STANDARD_NETWORK_ERROR,
        },
        {
          src: 'http://whatever.com/cdn/some-other-stylesheet.css',
          status: 'error',
          statusExplanation: STANDARD_NETWORK_ERROR,
        },
      ],
    }
    mountedCell = undefined
  })

  it('always renders one TwoRowCell', () => {
    expect(cell().find(TwoRowCell).length).toBe(1)
  })

  it("sets the TwoRowCell cellId prop to be the ExternalResourceCells's cellId prop", () => {
    expect(cell().find(TwoRowCell).props().cellId)
      .toBe(props.cellId)
  })

  it('the TwoRowCell always has a row1 prop that is a CellEditor', () => {
    expect(cell().wrap(cell().find(TwoRowCell)
      .props().row1).find(CellEditor)).toHaveLength(1)
  })

  it("sets the CellEditor cellId prop to be the ExternalResourceCell's cellId prop", () => {
    expect(cell().wrap(cell().find(TwoRowCell)
      .props().row1).props().cellId)
      .toBe(props.cellId)
  })

  it('the TwoRowCell always has a row2 prop that is an ExternalResourceOutput', () => {
    expect(cell().wrap(cell().find(TwoRowCell)
      .props().row2).find(ExternalResourceOutput)).toHaveLength(1)
  })
})

describe('ExternalResourceCell mapStateToProps', () => {
  const state = {
    cells: [{
      id: 5,
      value: [
        {
          src: 'http://whatever.com/cdn/a-library.js',
          status: 'loaded',
          variables: ['a', 'b', 'c'],
        },
        {
          src: 'http://whatever.com/cdn/a-stylsheet.css',
          status: 'loaded',
        },
        {
          src: 'http://whatever.com/cdn/some-other-library.js',
          status: 'error',
          statusExplanation: STANDARD_NETWORK_ERROR,
        },
        {
          src: 'http://whatever.com/cdn/some-other-stylesheet.css',
          status: 'error',
          statusExplanation: STANDARD_NETWORK_ERROR,
        },
      ],
    }],
  }

  it('should have the right number of value entries', () => {
    const ownProps = { cellId: 5 }
    expect(mapStateToProps(state, ownProps).value.length)
      .toEqual(4)
  })
})
