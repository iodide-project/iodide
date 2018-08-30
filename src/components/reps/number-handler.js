import React from 'react'

import nb from '../../tools/nb'

export default {
  shouldHandle: value => typeof (value) === 'number',
  render: (value, inContainer) => {
    const displayValue = inContainer ? nb.prettyFormatNumber(value, 6) : value
    return <span className="number-rep">{displayValue}</span>
  },
}
