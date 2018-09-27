import React from 'react'

const MAX_CHARS = 1000

export default {
  shouldHandle: value => typeof (value) === 'string',
  render: (value, inCollection) => {
    let extraClasses = ''
    if (inCollection) {
      extraClasses = 'string-rep-truncated'
    }

    const toggle = (e) => {
      const { classList } = e.currentTarget
      if (classList.contains('string-rep-truncated')) {
        classList.replace('string-rep-truncated', 'string-rep-expanded')
      } else if (classList.contains('string-rep-expanded')) {
        classList.replace('string-rep-expanded', 'string-rep-truncated')
      }
    }

    if (value.length <= MAX_CHARS) {
      return (
        <React.Fragment>
          <span onClick={toggle} className={`string-rep string-rep-before-quote string-rep-after-quote ${extraClasses}`}>
            {value}
          </span>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <span className={extraClasses} onClick={e => toggle(e)}>
          <span className="string-rep string-rep-before-quote">
            {value.slice(0, MAX_CHARS / 2)}
          </span>
          <span className="elements-omitted-info-rep">
            {`… ${value.length - MAX_CHARS} chars …`}
          </span>
          <span className="string-rep string-rep-after-quote">
            {value.slice(value.length - Math.round(MAX_CHARS / 2))}
          </span>
        </span>
      </React.Fragment>
    )
  },
}
