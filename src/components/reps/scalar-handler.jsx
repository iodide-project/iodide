import React from 'react'

const scalarHandler = {
  scalarTypes: {
    string: true,
    number: true,
  },

  shouldHandle: value => (typeof (value) in scalarHandler.scalarTypes),

  render: value =>
  // TODO: This probably needs a new CSS class
    <span className="array-output">{value}</span>,

}

export default scalarHandler
