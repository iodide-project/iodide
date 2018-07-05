/* Output handlers */

import React from 'react'
import PropTypes from 'prop-types'


import nullHandler from './null-handler'
import undefinedHandler from './undefined-handler'
import dataFrameHandler from './dataframe-handler'
import matrixHandler from './matrix-handler'
import arrayHandler from './array-handler'
import dateHandler from './date-handler'
import scalarHandler from './scalar-handler'
import promiseHandler from './promise-handler'
import domElementHandler from './dom-element-handler'
import defaultHandler from './default-handler'

export function renderValue(value, inContainer = false) {
  for (const handler of handlers) {
    if (handler.shouldHandle(value, inContainer)) {
      const resultElem = handler.render(value, inContainer)
      if (typeof resultElem === 'string') {
        return (<div>{ resultElem }</div>)
      } else if (resultElem.tagName !== undefined) {
        // custom output handlers may return HTMLElements,
        // so this checks for that, and if present dangerouslySetInnerHTML's it in
        // a container.
        return <div dangerouslySetInnerHTML={{ __html: resultElem.outerHTML }} /> // eslint-disable-line
      } else if (resultElem.type !== undefined) {
        return resultElem
      }
      console.warn(`Unknown output handler result type from ${handler}`)
      // Fallback to other handlers if it's something invalid
    }
  }
  return undefined
}


const renderMethodHandler = {
  shouldHandle: value => (value !== undefined && typeof value.iodideRender === 'function'),

  render: (value, inContainer) => {
    const output = value.iodideRender(inContainer)
    if (typeof output === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: output }} /> // eslint-disable-line
    }
    return undefined
  },
}


const errorHandler = {
  shouldHandle: value => value instanceof Error,
  render: (e) => {
    let { stack } = e
    if (e.lineNumber) {
      // this is firefox
      // prepend the name and message
      stack = `${e.name}: ${e.message}\n${stack}`
      // lines after the line beginning with "cellReducer@" can
      // be discarded, because they refer to app state not notebook state
      // stack = stack.slice(0, stack.indexOf('cellReducer@'))
    } else {
      // not FF;
      // for now, treat as chrome. it appears that anything after:
      // '    at cellReducer' is not useful.
    }
    return (
      <div className="error-output">
        <pre>{stack}</pre>
      </div>
    )
  },
}

const handlers = [
  errorHandler,
  nullHandler,
  undefinedHandler,
  renderMethodHandler,
  dataFrameHandler,
  matrixHandler,
  arrayHandler,
  dateHandler,
  scalarHandler,
  domElementHandler,
  promiseHandler,
  defaultHandler,
]

export function addOutputHandler(handler) {
  // TODO: We may want to be smarter about inserting handlers at
  // certain places in the handler array.  Right now, this just
  // puts the new handler at the front.
  handlers.unshift(handler)
}


export class ValueRenderer extends React.Component {
  static propTypes = {
    render: PropTypes.bool.isRequired,
    valueToRender: PropTypes.any,
  }

  render() {
    // console.log(`CellOutput rendered: ${this.props.cellId}`)
    if (!this.props.render) {
      return <div className="empty-resultset" />
    }

    const value = this.props.valueToRender
    const resultElem = renderValue(value)
    // if (resultElem !== undefined) {
    return <div className="rep-container">{resultElem}</div>
    // }
    // return <div className="empty-resultset" />
  }
}
