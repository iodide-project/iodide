/* Output handlers */

import React from 'react'
import PropTypes from 'prop-types'


import nullHandler from './null-handler'
import dataFrameHandler from './dataframe-handler'
import matrixHandler from './matrix-handler'
import arrayHandler from './array-handler'
import promiseHandler from './promise-handler'
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

  // We should never get here, since the default handler should handle everything
  console.warn(`No output handler found to handle ${value}`)
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


// this wraps all the handlers in a bit of try/catch
function wrapHandler(handler) {
  return {
    shouldHandle: (value) => {
      try {
        return handler.shouldHandle(value)
      } catch (error) {
        console.error('output handler error', error);
        return false
      }
    },
    render: (value, inContainer) => {
      try {
        return handler.render(value, inContainer)
      } catch (error) {
        console.error('output handler render error', error);
        return (
          <div>output handler failed:
            {errorHandler.render(error)}
          </div>
        )
      }
    },
  }
}

const simpleHandlers = [
  nullHandler,
].map(h => wrapHandler(h))

const complexHandlers = [
  renderMethodHandler,
  // data frame (array of objects must come before array)
  dataFrameHandler,
  // matrix must come before array!
  matrixHandler,
  arrayHandler,
  errorHandler,
  promiseHandler,
  defaultHandler,
].map(h => wrapHandler(h))

let handlers = simpleHandlers.concat(complexHandlers)

const userHandlers = []

export function addOutputHandler(handler) {
  // insert new handlers *after* the scalar handlers
  userHandlers.unshift(wrapHandler(handler))
  handlers = simpleHandlers.concat(userHandlers, complexHandlers)
}


export class ValueRenderer extends React.Component {
  static propTypes = {
    render: PropTypes.bool.isRequired,
    valueToRender: PropTypes.any,
    inContainer: PropTypes.bool,
  }

  render() {
    if (!this.props.render) {
      return <div className="empty-resultset" />
    }

    return renderValue(this.props.valueToRender, this.props.inContainer)
  }
}
