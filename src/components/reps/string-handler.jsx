import React from 'react'

const MAX_CHARS = 1000

export default {
  shouldHandle: value => typeof (value) === 'string',
  render: (value, inCollection) => {
    const maxChars = inCollection ? 10 : MAX_CHARS
    if (value.length <= maxChars) {
      return (
        <React.Fragment>
          <span className="string-rep string-rep-before-quote string-rep-after-quote">{value}</span>
        </React.Fragment>
      )
    }

    // In a collection, just truncate and add "…".
    // Outside a collection, insert the "X characters ommitted..." chunk in the middle
    if (inCollection) {
      return (
        <React.Fragment>
          <span className="string-rep string-rep-before-quote">{value.slice(0, maxChars)}</span>
          <span className="string-rep-ellipsis string-rep-after-quote">…</span>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <span className="string-rep string-rep-before-quote">{value.slice(0, maxChars / 2)}</span>
        <span className="elements-omitted-info-rep">
          {`… ${value.length - maxChars} chars …`}
        </span>
        <span className="string-rep string-rep-after-quote">
          {value.slice(value.length - Math.round(maxChars / 2))}
        </span>
      </React.Fragment>
    )
  },
}
