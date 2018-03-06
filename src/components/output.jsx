/* Output handlers */

import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import ReactTable from 'react-table'
import { ObjectInspector } from 'react-inspector'

import { SimpleTable, makeMatrixText } from './pretty-matrix'

import nb from '../tools/nb'

function renderValue(value, inContainer = false) {
  for (const handler of handlers) {
    if (handler.shouldHandle(value, inContainer)) {
      const resultElem = handler.render(value, inContainer)
      /* eslint-disable */
      if (typeof resultElem === 'string') {
        return <div dangerouslySetInnerHTML={{ __html: resultElem }} />
      } else if (resultElem.tagName !== undefined) {
        return <div dangerouslySetInnerHTML={{ __html: resultElem.outerHTML }} />
      } else if (resultElem.type !== undefined) {
        return resultElem
      } else {
        // Fallback to other handlers if it's something invalid
      }
      /* eslint-enable */
    }
  }
  return undefined
}

const renderMethodHandler = {
  shouldHandle: value => (value !== undefined && typeof value.render === 'function'),

  render: (value, inContainer) => {
    const output = value.render(inContainer)
    if (typeof output === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: output }} /> // eslint-disable-line
    }
    return undefined
  },
}

const dataFrameHandler = {
  shouldHandle: (value, inContainer) => !inContainer && nb.isRowDf(value),

  render: (value) => {
    const columns = Object.keys(value[0])
      .map(k => ({
        Header: k,
        accessor: k,
        Cell: cell => renderValue(cell.value, true),
      }))
    const dataSetInfo = `array of objects: ${value.length} rows, ${columns.length} columns`
    const pageSize = value.length > 10 ? 10 : value.length
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
  shouldHandle: (value, inContainer) => !inContainer && nb.isMatrix(value),

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
  shouldHandle: (value, inContainer) => !inContainer && _.isArray(value),

  render: (value) => {
    const dataSetInfo = `${value.length} element array`
    const len = value.length

    let arrayElements = _.range(len > 200 ? 100 : len - 2).map(i => (
      <span key={`array_elt_${i}`} title={`array index: ${i}`}>
        {renderValue(value[i], true)}{', '}
      </span>
    ))
    if (len > 200) {
      arrayElements.push(<span key="array_elts omitted">…, </span>)
      arrayElements = arrayElements
        .concat(_.range(len - 100, len - 2)
          .map(i => (
            <span key={`array_elt_${i}`} title={`array index: ${i}`}>
              {renderValue(value[i], true)}{', '}
            </span>
          )))
    }
    // final element has no trailing comma
    arrayElements.push((
      <span key={`array_elt_${len - 1}`} title={`array index: ${len - 1}`}>
        {renderValue(value[len - 1], true)}
      </span>
    ))
    return (
      <div>
        <div className="data-set-info">{dataSetInfo}</div>
        <div>
          [{arrayElements}]
        </div>
      </div>
    )
  },
}

const defaultHandler = {
  shouldHandle: () => true,

  render: value => <div><ObjectInspector data={value} /></div>,
  // render: value => value,
}

const handlers = [
  renderMethodHandler,
  dataFrameHandler,
  matrixHandler,
  arrayHandler,
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
