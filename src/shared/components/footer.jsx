import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

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
      {process.env.IODIDE_PUBLIC && (
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
      <ul>
        <React.Fragment>
          <li>
            Alpha Software - revision&nbsp;
            <a
              href={`https://github.com/iodide-project/iodide/tree/${process.env.COMMIT_HASH}`}
            >
              {process.env.COMMIT_HASH.substring(0, 10)}
            </a>
          </li>
          <li>
            <a href="https://github.com/iodide-project/iodide">Contribute</a>
          </li>
          <li>
            <a href="https://iodide-project.github.io/docs/">Docs</a>
          </li>
        </React.Fragment>
        {process.env.IODIDE_PUBLIC && (
          // only display terms of service on an official mozilla installation
          <React.Fragment>
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
          </React.Fragment>
        )}
      </ul>
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
