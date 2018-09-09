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
  // constructor(props) {
  //   super(props)
  //   this.onResizeStopHandler = this.onResizeStopHandler.bind(this)
  // }

  render() {
    return (
      <div
        style={Object.assign(
          { position: 'fixed' },
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
