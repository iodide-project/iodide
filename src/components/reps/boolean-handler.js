import React from 'react'

export default {
  shouldHandle: value => typeof (value) === 'boolean',
  render: value =>
    <span className="boolean-rep">{value.toString()}</span>,
}
