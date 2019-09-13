import React from "react";
import PropTypes from "prop-types";
import { css } from "emotion";
import styled from "@emotion/styled";
import THEME from "../theme";

const IodideLogoContainer = styled("h2")`
  margin: 0;
  margin-right: ${THEME.header.defaultSpacing};
  font-family: "Zilla Slab", serif;
  font-size: 30px;
  font-weight: 300;

  a {
    color: white;
    text-decoration: none;
  }
`;

export default class IodideLogo extends React.Component {
  static propTypes = {
    target: PropTypes.string,
    backLink: PropTypes.string
  };
  render() {
    return (
      <IodideLogoContainer>
        <a
          href={this.props.backLink}
          rel="noopener noreferrer"
          target={this.props.target || "_blank"}
          className={css`
            color: white;
            text-decoration: none;
          `}
        >
          Iodide
        </a>
      </IodideLogoContainer>
    );
  }
}
