import React from 'react'
import { css } from 'emotion'
import styled from 'react-emotion'
import PropTypes from 'prop-types'

const buttonReset = css`
display: inline-block;
text-transform: uppercase;
background: none;
padding: 6px;
padding-left: 10px;
padding-right: 10px;
margin-left: 4px;
margin-right: 4px;
font-weight: bold;
transition: 50ms;
border: 1px solid rgba(0,0,0,0);
border-radius: 4px;
text-decoration: none;
`

const TextButtonContainer = elementType => styled(elementType)`
${buttonReset}
color: ${props => props.buttonColor || 'darkblue'};
font-size: ${props => props.size || '13px'};

:hover {
  color: black;
}
`

const OutlineButtonContainer = elementType => styled(elementType)`
${buttonReset}
color: ${props => props.buttonColor || 'darkblue'};
border: 1px solid darkgray;
font-size: ${props => props.size || '13px'};

:hover {
  background-color: lightgray;
}
`

const ContainedButtonContainer = elementType => styled(elementType)`
${buttonReset}
color: white;
background-color: ${props => props.buttonColor || 'blue'};
font-size: ${props => props.size || '13px'};

:hover {
  background-color: ${props => props.buttonHoverColor || 'darkblue'};
}

`

const ButtonFactory = (buttonType, props) => {
  const buttonTask = props.href ? 'a' : 'button'
  return React.createElement(buttonType(buttonTask), props)
}

export class TextButton extends React.Component {
  render() { return ButtonFactory(TextButtonContainer, this.props) }
}

export class OutlineButton extends React.Component {
  render() { return ButtonFactory(OutlineButtonContainer, this.props) }
}

export class ContainedButton extends React.Component {
  render() { return ButtonFactory(ContainedButtonContainer, this.props) }
}

const buttonPropTypes = {
  size: PropTypes.number,
  buttonColor: PropTypes.string,
  buttonHoverColor: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
}

TextButton.propTypes = buttonPropTypes
OutlineButton.propTypes = buttonPropTypes
ContainedButton.propTypes = buttonPropTypes
