import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

export const defaultStyle = {
  position: "fixed",
  border: "1px solid #cbcbcb",
  zIndex: 10,
  overflow: "hidden"
};

export class FixedPositionContainerUnconnected extends React.Component {
  static propTypes = {
    style: PropTypes.shape({
      display: PropTypes.string.isRequired,
      top: PropTypes.number.isRequired,
      left: PropTypes.number.isRequired,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired
    }).isRequired,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.array
    ])
  };

  render() {
    return (
      <div
        className="fixed-position-container"
        style={Object.assign({}, defaultStyle, this.props.style)}
      >
        {this.props.children}
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  // need to assign to new object so that component updates when getting props
  let style = Object.assign({}, state.panePositions[ownProps.paneId]);
  if (ownProps.hidden) {
    style.display = "none";
  }
  if (ownProps.fullscreen) {
    style = {
      display: "block",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%"
    };
  }
  return {
    style
  };
}

export default connect(mapStateToProps)(FixedPositionContainerUnconnected);
