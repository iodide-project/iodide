import React from "react";
import PropTypes from "prop-types";

import styled from "@emotion/styled";
import { connect } from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";
import PanoramaFishEye from "@material-ui/icons/PanoramaFishEye";
import Error from "@material-ui/icons/Error";
import ErrorOutline from "@material-ui/icons/ErrorOutline";

const KernelContainer = styled("div")`
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: middle;
`;

const IconContainer = styled("div")`
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || "white"};
`;

export class KernelStateUnconnected extends React.Component {
  static propTypes = {
    kernelText: PropTypes.string.isRequired,
    color: PropTypes.string
  };

  render() {
    const { kernelText, color } = this.props;
    let StatusIcon;

    switch (kernelText) {
      case "Kernel Idle":
        StatusIcon = <PanoramaFishEye size={20} />;
        break;
      case "Kernel Error":
        StatusIcon = <ErrorOutline size={20} />;
        break;
      case "Kernel Didn't Load":
        StatusIcon = <Error size={20} />;
        break;
      default:
        StatusIcon = <CircularProgress size={20} />;
    }

    return (
      <Tooltip classes={{ tooltip: "iodide-tooltip" }} title={kernelText}>
        <KernelContainer>
          <IconContainer color={color}>{StatusIcon}</IconContainer>
        </KernelContainer>
      </Tooltip>
    );
  }
}

export function mapStateToProps(state) {
  const { kernelState } = state;
  let kernelText = "Kernel Status";
  let color;
  switch (kernelState) {
    case "KERNEL_BUSY":
      kernelText = "Kernel Busy";
      break;
    case "KERNEL_LOADING":
      kernelText = "Kernel Loading";
      break;
    case "KERNEL_IDLE":
      kernelText = "Kernel Idle";
      color = "forestgreen";
      break;
    case "KERNEL_ERROR":
      kernelText = "Kernel Error";
      color = "gray";
      break;
    case "KERNEL_LOAD_ERROR":
      kernelText = "Kernel Didn't Load";
      color = "red";
      break;
    default:
      kernelText = "Kernel Status";
  }
  return {
    kernelText,
    color
  };
}

export default connect(mapStateToProps)(KernelStateUnconnected);
