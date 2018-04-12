/* Output handlers */

import React from 'react'
import PropTypes from 'prop-types'
// import { connect } from 'react-redux'

import JSONTree from 'react-json-tree'


// import { getCellById } from '../../tools/notebook-utils'

import nullHandler from './null-handler'
import undefinedHandler from './undefined-handler'
import dataFrameHandler from './dataframe-handler'
import matrixHandler from './matrix-handler'
import arrayHandler from './array-handler'
import dateHandler from './date-handler'
import scalarHandler from './scalar-handler'

export function renderValue(value, inContainer = false) {
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
        console.warn('Unknown output handler result type from ' + handler)
        // Fallback to other handlers if it's something invalid
      }
      /* eslint-enable */
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
