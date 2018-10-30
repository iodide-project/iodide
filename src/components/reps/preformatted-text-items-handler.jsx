import React from 'react'
import PropTypes from 'prop-types'

export default class PreformattedTextItemsHandler extends React.Component {
  static propTypes = {
    textItems: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })),
  }

  render() {
    return (
      <pre className="fetch-cell-output">
        {this.props.textItems.map(t => (
          <React.Fragment key={t.id}>
            {t.text}
          </React.Fragment>
        ))}
      </pre>
    )
  }
}
