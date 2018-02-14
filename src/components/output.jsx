/* Output handlers */

import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import JSONTree from 'react-json-tree'
import ReactTable from 'react-table'

import { SimpleTable, makeMatrixText } from './pretty-matrix'

import nb from '../tools/nb'

function renderValue(value, ignoreHandlers = []) {
  for (const handler of handlers) {
    if (!ignoreHandlers.includes(handler)) {
      if (handler.shouldHandle(value)) {
        const resultElem = handler.render(value)
        /* eslint-disable */
        if (typeof resultElem === 'string') {
          return <div dangerouslySetInnerHTML={{ __html: resultElem }} />
        } else if (resultElem.tagName !== undefined) {
          return <div dangerouslySetInnerHTML={{ __html: resultElem.outerHTML }} />
        } else if (resultElem.type !== undefined) {
          return resultElem
        } else {
          console.log('Unknown output handler result type from ' + handler)
          // Fallback to other handlers if it's something invalid
        }
        /* eslint-enable */
      }
    }
  }
}

const nullHandler = {
  shouldHandle: value => (value === null),

  render: () => <pre>null</pre>,
}

const undefinedHandler = {
  shouldHandle: value => (value === undefined),

  render: () => <pre>undefined</pre>,
}

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
    const columns = Object.keys(value[0])
      .map(k => ({
        Header: k,
        accessor: k,
        Cell: cell => renderValue(cell.value, [dataFrameHandler]),
      }))
    const dataSetInfo = `array of objects: ${value.length} rows, ${columns.length} columns`
    let pageSize = value.length > 10 ? 10 : value.length
    return (
      <div>
        <div className="data-set-info">{dataSetInfo}</div>
        <ReactTable
          data={value}
          columns={columns}
          showPaginationTop
          showPaginationBottom={false}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          minRows={0}
          defaultPageSize={pageSize}
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

    let values = []

    function addValues(start, end) {
      for (let i = start; i < end; i++) {
        values.push(renderValue(value[i]))
        if (i !== end - 1) {
          values.push(', ')
        }
      }
    }

    values.push('[')
    if (len < 500) {
      addValues(0, len)
    } else {
      addValues(0, 100)
      values.push(' … ')
      addValues(len - 100, len)
    }
    values.push(']')

    return (
      <div>
        <div className="data-set-info">{dataSetInfo}</div>
        {values}
      </div>
    )
  },
}

const dateHandler = {
  shouldHandle: value => Object.prototype.toString.call(value) === '[object Date]',

  render: value => value.toString(),
}

const scalarHandler = {
  scalarTypes: {
    string: true,
    number: true,
  },

  shouldHandle: value => (typeof (value) in scalarHandler.scalarTypes),

  render: value =>
  // TODO: This probably needs a new CSS class
    <span className="array-output">{value}</span>,

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
  nullHandler,
  undefinedHandler,
  renderMethodHandler,
  dataFrameHandler,
  matrixHandler,
  arrayHandler,
  dateHandler,
  scalarHandler,
  defaultHandler,
]

export function addOutputHandler(handler) {
  // TODO: We may want to be smarter about inserting handlers at
  // certain places in the handler array.  Right now, this just
  // puts the new handler at the front.
  handlers.unshift(handler)
}

export default class CellOutput extends React.Component {
  static propTypes = {
    render: PropTypes.bool.isRequired,
    valueToRender: PropTypes.any,
  }

  render() {
    if (!this.props.render ||
        this.props.valueToRender === undefined) {
      return <div className="empty-resultset" />
    }

    const value = this.props.valueToRender
    const resultElem = renderValue(value)
    if (resultElem !== undefined) {
      return resultElem
    }
    return <div className="empty-resultset" />
  }
}
