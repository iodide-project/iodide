/* global IODIDE_PUBLIC */
import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";

const FooterContainer = styled("footer")`
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

const Footer = ({ showIcon = true }) => (
  <FooterContainer showIcon={showIcon}>
    <FooterDiv>
      <p>
        iodide is brought to you by <a href="https://mozilla.org">Mozilla</a>.
      </p>
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
      {// only display terms of service on an official mozilla installation
      IODIDE_PUBLIC && (
        <ul>
          <li>Alpha Software</li>
          <li>
            <a href="https://github.com/iodide-project/iodide">Contribute</a>
          </li>
          <li>
            <a href="https://iodide-project.github.io/docs/">Docs</a>
          </li>
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
        <small>© 2018-2019 Mozilla and other contributors</small>.
      </p>
    </FooterDiv>
  </FooterContainer>
);

Footer.propTypes = {
  showIcon: PropTypes.bool
};

export default Footer;
