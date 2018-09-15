import React from 'react'
import { css } from 'emotion'
import styled from 'react-emotion'

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

export const TextButton = props => ButtonFactory(TextButtonContainer, props)
export const OutlineButton = props => ButtonFactory(OutlineButtonContainer, props)
export const ContainedButton = props => ButtonFactory(ContainedButtonContainer, props)
