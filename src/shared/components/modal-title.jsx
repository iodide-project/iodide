import React from "react";
import styled from "react-emotion";

const ModalTitleContainer = styled("h1")`
  margin: 0;
  font-size: 1em;
  margin-bottom: 20px;
  margin-left: 12px;
  margin-right: 12px;
  margin-top: 12px;
  text-transform: uppercase;
`;

export default class ModalTitle extends React.Component {
  render() {
    return <ModalTitleContainer>{this.props.children}</ModalTitleContainer>;
  }
}
