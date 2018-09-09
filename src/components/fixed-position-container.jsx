import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class FixedPositionContainerUnconnected extends React.Component {
  static propTypes = {
    style: PropTypes.shape({
      display: PropTypes.string.isRequired,
      top: PropTypes.number.isRequired,
      left: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
  }

  render() {
    return (
      <div
        className="fixed-position-container"
        style={Object.assign(
          {
            position: 'fixed',
            border: '1px solid #cbcbcb',
            zIndex: 10,
            overflow: 'hidden',
          },
          this.props.style,
          )}
      >
        {this.props.children}
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    style: state.panePositions[ownProps.paneId],
  }
}

export default connect(mapStateToProps)(FixedPositionContainerUnconnected)
