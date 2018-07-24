import React from 'react'

export default {
  shouldHandle: value => typeof (value) === 'function',
  render: value =>
    <span className="function-rep">function {value.name}()</span>,
}
