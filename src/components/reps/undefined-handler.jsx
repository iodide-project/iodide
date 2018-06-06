import React from 'react'

export default {
  shouldHandle: value => value === undefined,
  render: () => <pre className="undefined-rep">undefined</pre>,
}
