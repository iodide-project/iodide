import React from 'react'

import { renderValue } from './value-renderer'

export class PromiseRep extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'pending',
      value: undefined,
      runTime: 0,
    }
    this.state.promise = this.props.promise.then(
      (val) => {
        this.setState({ status: 'fulfilled', value: val })
        return val
      },
      (val) => {
        this.setState({ status: 'rejected', value: val })
        return val
      },
    ).catch((e) => {
      this.setState({ status: 'rejected', value: e })
    })
    const runTimer = setInterval(() => {
      if (this.state.status === 'pending') {
        this.setState({ runTime: this.state.runTime + 1 })
      } else {
        clearInterval(runTimer)
      }
    }, 1000)
  }

  render() {
    const { value, status, runTime } = this.state
    let outputValue
    let statusDisplay = status
    if (status === 'fulfilled' || status === 'rejected') {
      outputValue = <div className="promise-handler-value">{renderValue(value)}</div>
    } else if (status === 'pending') {
      statusDisplay = `pending (${runTime} sec)`
    }
    return (
      <div>
        <div className="promise-handler-state">
          <div className="promise-handler-label">
                Promise
          </div>
          <div className="promise-handler-status">
            {statusDisplay}
          </div>
        </div>
        {outputValue}
      </div>
    )
  }
}

export default {
  // based off of https://stackoverflow.com/questions/27746304/how-do-i-tell-if-an-object-is-a-promise
  // It is unfortunate that this seems to be the main perspective for how to determine if
  // something is Promise-ful. Ideally we would check only for native Promises,
  // but at this point I don't know if others use Promise-based libraries.

  // EDIT: for now, let's check ONLY for native promises.
  // shouldHandle: val => typeof val === 'object' && typeof val.then === 'function',
  shouldHandle: value => Object.prototype.toString.call(value) === '[object Promise]',

  // render is going to need to be more involved.
  render: value => (
    <div>
      <PromiseRep promise={value} />
    </div>
  ),
}
