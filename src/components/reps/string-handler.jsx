import React from 'react'

import { Inspector } from 'react-inspector'

const MAX_CHARS = 1000

const renderString = (value, inCollection) => {
  const maxChars = inCollection ? 20 : MAX_CHARS
  if (value.length <= maxChars) {
    return (
      <React.Fragment>
        <span className="string-rep string-rep-before-quote string-rep-after-quote">{value}</span>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <span className="string-rep string-rep-before-quote">{value.slice(0, MAX_CHARS / 2)}</span>
      <span className="elements-omitted-info-rep">
        {` ... ${value.length - MAX_CHARS} characters omitted ...`}
      </span>
      <span className="string-rep string-rep-after-quote">
        {value.slice(value.length - Math.round(MAX_CHARS / 2))}
      </span>
    </React.Fragment>
  )
}

export default {
  shouldHandle: value => typeof (value) === 'string',
  render: (value, inCollection) => {
    const nodeRenderer = ({
      data,
    }) => renderString(data, inCollection)

    if (!inCollection) {
      return <Inspector data={value} nodeRenderer={nodeRenderer} />
    }
    return renderString(value, inCollection);
  },
}
