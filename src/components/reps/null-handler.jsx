import React from 'react'

export default {
  shouldHandle: value => (value === null),

  render: () => <pre className="null-rep">null</pre>,
}
