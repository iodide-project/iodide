/* Output handlers */

import React from 'react'

import JSONTree from 'react-json-tree'

import {PrettyMatrix, SimpleTable, makeMatrixText} from './pretty-matrix.jsx'

import nb from '../tools/nb.js'


class OutputHandler extends React.Component {
  static should_handle(cell) {
    return false;
  }

  static format(cell) {
    return <div className='empty-resultset' />
  }
}


class UndefinedHandler extends OutputHandler {
  static should_handle(cell) {
    return (cell.value == undefined)
  }

  static format(cell) {
    if (cell.rendered) {
      return <div className='data-set-info'>undefined</div>
    } else {
      return <div className='empty-resultset' />
    }
  }
}

class DataFrameHandler extends OutputHandler {
  static should_handle(cell) {
    return nb.isRowDf(cell.value)
  }

  static format(cell) {
    let columns = Object.keys(cell.value[0]).map((k) => ({Header: k, accessor: k}))
    var dataSetInfo = `array of objects: ${cell.value.length} rows, ${columns.length} columns`
    return (<div>
        <div className='data-set-info'>{dataSetInfo}</div>
        <ReactTable
        data={cell.value}
        columns={columns}
        showPaginationTop
        showPaginationBottom={false}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        defaultPageSize={25}
        />
    </div>)
  }
}

class MatrixHandler extends OutputHandler {
  static should_handle(cell) {
    return nb.isMatrix(cell.value)
  }

  static format(cell) {
    let shape = nb.shape(cell.value)
    var dataSetInfo = `${shape[0]} × ${shape[1]} matrix (array of arrays)`
    let tabledata = makeMatrixText(cell.value, [10, 10])
    return (<div>
      <div className='data-set-info'>{dataSetInfo}</div>
      <SimpleTable tabledata={tabledata} />
    </div>)
  }
}

class ArrayHandler extends OutputHandler {
  static should_handle(cell) {
    return _.isArray(cell.value)
  }

  static format(cell) {
    var dataSetInfo = `${cell.value.length} element array`
    let len = cell.value.length
    if (len < 500) {
      var arrayOutput = `[${cell.value.join(', ')}]`
    } else {
      var arrayOutput = `[${cell.value.slice(0, 100).join(', ')}, ... , ${cell.value.slice(len - 100, len).join(', ')}]`
    }
    return (<div>
      <div className='data-set-info'>{dataSetInfo}</div>
      <div className='array-output'>{arrayOutput}</div>
    </div>)
  }
}

class DefaultHandler extends OutputHandler {
  static should_handle(cell) {
    return true;
  }

  static format(cell) {
    return <JSONTree
             data={cell.value}
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
  UndefinedHandler,
  DataFrameHandler,
  MatrixHandler,
  ArrayHandler,
  DefaultHandler
]

export default function formatOutput(cell) {
  if (cell.cellType === 'dom') return <div className='empty-resultset' />

  for (let i = 0; i < handlers.length; i++) {
    if (handlers[i].should_handle(cell)) {
      let resultElem = handlers[i].format(cell)
      if (resultElem !== undefined) {
        return resultElem
      }
    }
  }

  return <div className='empty-resultset' />
}
