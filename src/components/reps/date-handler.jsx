import React from 'react'

export default {
  shouldHandle: value => Object.prototype.toString.call(value) === '[object Date]',
  render: (value, inCollection) => {
    if (inCollection) {
      return <div className="date-rep-small">{value.toISOString().replace('T', ' ')}</div>
    }
    return value.toString()
  },
}
