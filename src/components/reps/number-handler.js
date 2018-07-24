import React from 'react'

export default {
  shouldHandle: value => typeof (value) === 'number',
  render: value =>
    <span className="number-rep">{value}</span>,
}
