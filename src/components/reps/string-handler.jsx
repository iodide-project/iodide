import React from 'react'

const MAX_CHARS = 1000

export default {
  shouldHandle: value => typeof (value) === 'string',
  render: (value) => {
    if (value.length < MAX_CHARS) {
      return (
        <React.Fragment>
          <span className="string-rep string-rep-before-quote string-rep-after-quote">{value}</span>
        </React.Fragment>
      )
    }

    // else:
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
  },
}
