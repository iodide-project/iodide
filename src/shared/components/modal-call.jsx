import React from 'react';
import styled from 'react-emotion';

const ModalCallContainer = styled('div')`
display: flex;
align-items: baseline;
justify-content: flex-end;
margin-top: 20px;
`

export default class ModalCall extends React.Component {
  render() {
    return (<ModalCallContainer>{this.props.children}</ModalCallContainer>)
  }
}
