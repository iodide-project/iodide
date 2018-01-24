/* Output handlers */

import React from 'react'

import JSONTree from 'react-json-tree'

import {PrettyMatrix, SimpleTable, makeMatrixText} from './pretty-matrix.jsx'

import nb from '../tools/nb.js'


const dataFrameHandler = {
  shouldHandle: value => {
    return nb.isRowDf(value)
  },

  render: value => {
    let columns = Object.keys(value[0]).map((k) => ({Header: k, accessor: k}))
    var dataSetInfo = `array of objects: ${value.length} rows, ${columns.length} columns`
    return (<div>
        <div className='data-set-info'>{dataSetInfo}</div>
        <ReactTable
        data={value}
        columns={columns}
        showPaginationTop
        showPaginationBottom={false}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        defaultPageSize={25}
        />
    </div>)
  }
}

const matrixHandler = {
  shouldHandle: value => {
    return nb.isMatrix(value)
  },

  render: value => {
    let shape = nb.shape(value)
    var dataSetInfo = `${shape[0]} × ${shape[1]} matrix (array of arrays)`
    let tabledata = makeMatrixText(value, [10, 10])
    return (<div>
      <div className='data-set-info'>{dataSetInfo}</div>
      <SimpleTable tabledata={tabledata} />
    </div>)
  }
}

const arrayHandler = {
  shouldHandle: value => {
    return _.isArray(value)
  },

  render: value => {
    var dataSetInfo = `${value.length} element array`
    let len = value.length
    if (len < 500) {
      var arrayOutput = `[${value.join(', ')}]`
    } else {
      var arrayOutput = `[${value.slice(0, 100).join(', ')}, ... , ${value.slice(len - 100, len).join(', ')}]`
    }
    return (<div>
      <div className='data-set-info'>{dataSetInfo}</div>
      <div className='array-output'>{arrayOutput}</div>
    </div>)
  }
}

const scalarHandler = {
  scalarTypes: {
    'undefined': true,
    string: true,
    number: true
  },

  shouldHandle: value => {
    return (typeof(value) in scalarHandler.scalarTypes)
  },

  render: value => {
    // TODO: This probably needs a new CSS class
    return <div className='array-output'>{value}</div>
  }
}

const defaultHandler = {
  shouldHandle: value => {
    return true;
  },

  render: value => {
    return <JSONTree
             data={value}
             shouldExpandNode={(keyName, data, level) => {
                 return false
             }}
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
             }} />
  }
}

let handlers = [
  dataFrameHandler,
  matrixHandler,
  arrayHandler,
  scalarHandler,
  defaultHandler
]

export default class CellOutput extends React.Component {
  render() {
    let value = this.props.valueToRender

    for (let handler of handlers) {
      if (handler.shouldHandle(value)) {
        let resultElem = handler.render(value)
        if (resultElem !== undefined) {
          return resultElem
        }
      }
    }

    return <div className='empty-resultset' />
  }
}
