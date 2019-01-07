/* global IODIDE_PUBLIC */
import React from 'react'
import styled from 'react-emotion'
import { css } from 'emotion'
import { sharedProperties } from '../style/base'

const FooterContainer = styled('footer')`
width: ${sharedProperties.narrowContentWidth};
margin: auto;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
justify-items: center;
align-items: center;
padding-top: 15px;
padding-bottom: 15px;
font-size: 0.815rem;
margin-top: 30px;
text-align: center;
color: gray;
`

const LogoContainer = styled('div')`
transform: scale(${props => props.scale || 0.8});
color: ${props => props.color};
font-weight: 300;
font-size: 40px;
font-family: monospace;
border: 2px solid ${props => props.color};
border-radius: 5px;
padding-left: 14px;
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

const Logo = () => (
  <LogoContainer color="grey">
    <div className={innerLogoStyle}>I<span>&#x207B;</span></div>
  </LogoContainer>
)

const FooterDiv = styled('div')`
text-align: left;
padding: 0px;
ul {
  padding-inline-start: 0px;
}
li {
  display: inline-block;
  margin-right: 20px;
}
`

export default () => (
  <FooterContainer>
    <FooterDiv>
      <p>iodide is brought to you by <a href="https://mozilla.org">Mozilla</a>.</p>
      {
        // only display terms of service on an official mozilla installation
        IODIDE_PUBLIC && (
          <ul>
            <li><a href="https://www.mozilla.org/about/legal/terms/mozilla">Terms</a></li>
            <li><a href="https://www.mozilla.org/privacy/websites/">Privacy</a></li>
            <li><a href="https://www.mozilla.org/privacy/websites/#cookies">Cookies</a></li>
          </ul>
        )
      }
      <p><small>© 2018 Mozilla and other contributors</small>.</p>
    </FooterDiv>
    <Logo />
    <FooterDiv>
      {
        IODIDE_PUBLIC && (
          <p>
            Content available under the terms of the&nbsp;
            <a href="https://creativecommons.org/licenses/by-sa/3.0/deed.en" target="_blank" rel="noopener noreferrer">
              Creative Commons Attribution-ShareAlike 3.0 Unported license
            </a>.
          </p>
        )
      }
      <p>Extremely alpha software - <a href="https://github.com/iodide-project/iodide">contribute</a>.</p>
    </FooterDiv>
  </FooterContainer>
)
