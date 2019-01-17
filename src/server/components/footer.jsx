/* global IODIDE_PUBLIC */
import React from "react";
import styled from "react-emotion";
import LogoMark from "../../shared/components/logo/logo-mark";
import { sharedProperties } from "../style/base";

const FooterContainer = styled("footer")`
  width: ${sharedProperties.pageWidth}px;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 15px;
  justify-items: center;
  align-items: top;
  padding-top: 15px;
  padding-bottom: 15px;
  font-size: 0.815rem;
  margin-top: 30px;
  text-align: center;
  color: gray;
`;

const FooterDiv = styled("div")`
  text-align: left;
  padding: 0px;
  width: 100%;
  ul {
    padding-inline-start: 0px;
  }
  li {
    display: inline-block;
    margin-right: 20px;
  }
`;

const FooterLogo = styled(LogoMark)`
  width: 40px;
  transform: rotate(5deg);
`;

export default ({ showIcon = true }) => (
  <FooterContainer showIcon={showIcon}>
    <FooterDiv>
      <p>
        iodide is brought to you by <a href="https://mozilla.org">Mozilla</a>.
      </p>
      {// only display terms of service on an official mozilla installation
      IODIDE_PUBLIC && (
        <ul>
          <li>
            <a href="https://www.mozilla.org/about/legal/terms/mozilla">
              Terms
            </a>
          </li>
          <li>
            <a href="https://www.mozilla.org/privacy/websites/">Privacy</a>
          </li>
          <li>
            <a href="https://www.mozilla.org/privacy/websites/#cookies">
              Cookies
            </a>
          </li>
        </ul>
      )}
      <p>
        <small>© 2018 Mozilla and other contributors</small>.
      </p>
    </FooterDiv>
    {showIcon ? <FooterLogo /> : <div />}
    <FooterDiv>
      {IODIDE_PUBLIC && (
        <p>
          Content available under the terms of the&nbsp;
          <a
            href="https://creativecommons.org/licenses/by-sa/3.0/deed.en"
            target="_blank"
            rel="noopener noreferrer"
          >
            Creative Commons Attribution-ShareAlike 3.0 Unported license
          </a>
          .
        </p>
      )}
      <p>
        Extremely alpha software -{" "}
        <a href="https://github.com/iodide-project/iodide">contribute</a>.
      </p>
    </FooterDiv>
  </FooterContainer>
);
