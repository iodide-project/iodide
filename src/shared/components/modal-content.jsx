import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

const ModalContentContainer = styled("div")`
  flex-grow: 2;
  margin-bottom: 20px;
  margin-left: 12px;
  margin-right: 12px;
  color: gray;
`;

export default class ModalContent extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.array
    ])
  };
  render() {
    return <ModalContentContainer>{this.props.children}</ModalContentContainer>;
  }
}
