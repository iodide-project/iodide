import React from "react";
import styled from "react-emotion";

const ModalContentContainer = styled("div")`
  flex-grow: 2;
  margin-bottom: 20px;
  margin-left: 12px;
  margin-right: 12px;
  color: gray;
`;

export default class ModalContent extends React.Component {
  render() {
    return <ModalContentContainer>{this.props.children}</ModalContentContainer>;
  }
}
