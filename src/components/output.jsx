/* Output handlers */

import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import JSONTree from 'react-json-tree'
import ReactTable from 'react-table'

import { SimpleTable, makeMatrixText } from './pretty-matrix'

import nb from '../tools/nb'

const renderMethodHandler = {
  shouldHandle: value => (value !== undefined && typeof value.render === 'function'),

  render: (value) => {
    const output = value.render()
    if (typeof output === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: output }} /> // eslint-disable-line
    }
    return undefined
  },
}

const dataFrameHandler = {
  shouldHandle: value => nb.isRowDf(value),

  render: (value) => {
    const columns = Object.keys(value[0]).map(k => ({ Header: k, accessor: k }))
    const dataSetInfo = `array of objects: ${value.length} rows, ${columns.length} columns`
    return (
      <div>
        <div className="data-set-info">{dataSetInfo}</div>
        <ReactTable
          data={value}
          columns={columns}
          showPaginationTop
          showPaginationBottom={false}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          defaultPageSize={25}
        />
      </div>
    )
  },
}

const matrixHandler = {
  shouldHandle: value => nb.isMatrix(value),

  render: (value) => {
    const shape = nb.shape(value)
    const dataSetInfo = `${shape[0]} × ${shape[1]} matrix (array of arrays)`
    const tabledata = makeMatrixText(value, [10, 10])
    return (
      <div>
        <div className="data-set-info">{dataSetInfo}</div>
        <SimpleTable tabledata={tabledata} />
      </div>
    )
  },
}

const arrayHandler = {
  shouldHandle: value => _.isArray(value),

  render: (value) => {
    const dataSetInfo = `${value.length} element array`
    const len = value.length
    let arrayOutput
    if (len < 500) {
      arrayOutput = `[${value.join(', ')}]`
    } else {
      arrayOutput = `[${value.slice(0, 100).join(', ')}, ... , ${value.slice(len - 100, len).join(', ')}]`
    }
    return (
      <div>
        <div className="data-set-info">{dataSetInfo}</div>
        <div className="array-output">{arrayOutput}</div>
      </div>
    )
  },
}

const scalarHandler = {
  scalarTypes: {
    undefined: true,
    string: true,
    number: true,
  },

  shouldHandle: value => (typeof (value) in scalarHandler.scalarTypes),

  render: value =>
  // TODO: This probably needs a new CSS class
    <div className="array-output">{value}</div>,

}

const defaultHandler = {
  shouldHandle: () => true,

  render: value => (
    <JSONTree
      data={value}
      shouldExpandNode={() => false}
      hideRoot={false}
      theme={{
        scheme: 'bright',
        author: 'chris kempson (http://chriskempson.com)',
        base00: '#000000',
        base01: '#303030',
        base02: '#505050',
        base03: '#b0b0b0',
        base04: '#d0d0d0',
        base05: '#e0e0e0',
        base06: '#f5f5f5',
        base07: '#ffffff',
        base08: '#fb0120',
        base09: '#fc6d24',
        base0A: '#fda331',
        base0B: '#a1c659',
        base0C: '#76c7b7',
        base0D: '#6fb3d2',
        base0E: '#d381c3',
        base0F: '#be643c',
      }}
    />
  ),
}

const handlers = [
  renderMethodHandler,
  dataFrameHandler,
  matrixHandler,
  arrayHandler,
  scalarHandler,
  defaultHandler,
]

export default class CellOutput extends React.Component {
  static propTypes = {
    render: PropTypes.bool.isRequired,
    valueToRender: PropTypes.string,
  }
  render() {
    if (!this.props.render) {
      return <div className="empty-resultset" />
    }

    const value = this.props.valueToRender

    for (const handler of handlers) {
      if (handler.shouldHandle(value)) {
        const resultElem = handler.render(value)
        if (resultElem !== undefined) {
          return resultElem
        }
      }
    }

    return <div className="empty-resultset" />
  }
}
