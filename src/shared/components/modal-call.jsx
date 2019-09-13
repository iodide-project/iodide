import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

const ModalCallContainer = styled("div")`
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  margin-top: 20px;
`;

export default class ModalCall extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.array
    ])
  };
  render() {
    return <ModalCallContainer>{this.props.children}</ModalCallContainer>;
  }
}
