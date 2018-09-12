import React from 'react'
import styled from 'react-emotion'
import { css } from 'emotion'

const FooterContainer = styled('footer')`
display: grid;
grid-template-columns: 1fr 1fr 1fr;
justify-items: center;
align-items: center;
padding-top: 15px;
padding-bottom: 15px;
font-size: 0.815rem;
text-transform: uppercase;
margin-top: 30px;
text-align: center;
`

const LogoContainer = styled('div')`
transform: scale(${props => props.scale || 0.8});
color: ${props => props.color};
font-weight: 300;
font-size: 40px;
font-family: monospace;
border: 2px solid ${props => props.color};
border-radius: 5px;
padding-left:11px;
padding-top: 4px;
padding-bottom:2px;
`

const innerLogoStyle = css`
transform: scale(.75, 1);
height: inherit;
width: inherit;
text-align: center;

span {
  font-size: .9em;
  display: inline-block;
  position: relative;
  top:-9px;
  left: -3px;
}
`

export const Logo = () => (
  <LogoContainer color="grey">
    <div className={innerLogoStyle}>I<span>&#x207B;</span></div>
  </LogoContainer>
)

export default () => (
  <FooterContainer>
    <div>
    © Iodide 2018
    </div>
    <Logo />
    <div>
        Extremely Alpha
    </div>
  </FooterContainer>
)
