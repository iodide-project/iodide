import React from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import THEME from "../theme";

export const ButtonGroup = styled("div")`
  margin: auto;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 60px;
`;

export const GenericButton = styled("button")`
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
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 4px;
  text-decoration: none;

  :hover {
    cursor: pointer;
  }
`;

const TextButtonContainer = elementType => styled(
  GenericButton.withComponent(elementType)
)`
  color: ${props => props.buttonColor || THEME.button.baseColor};
  font-size: ${props => props.size || "13px"};
  :hover {
    color: black;
    background-color: lightgray;
  }
`;

const OutlineButtonContainer = elementType => styled(
  GenericButton.withComponent(elementType)
)`
  color: ${props => props.buttonColor || THEME.button.baseColor};
  border: 1px solid darkgray;
  font-size: ${props => props.size || "13px"};

  :hover {
    background-color: lightgray;
  }
`;

const ContainedButtonContainer = elementType => styled(
  GenericButton.withComponent(elementType)
)`
  color: white;
  background-color: ${props => props.buttonColor || THEME.button.baseColor};
  font-size: ${props => props.size || "13px"};

  :hover {
    background-color: ${props =>
      props.buttonHoverColor || THEME.button.hoverColor};
  }
`;

const ButtonFactory = (buttonType, etc) => {
  const buttonTask = etc.href ? "a" : "button";
  return React.createElement(buttonType(buttonTask), etc);
};

const buttonPropTypes = () => ({
  size: PropTypes.number,
  buttonColor: PropTypes.string,
  buttonHoverColor: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func
});

export class TextButton extends React.Component {
  render() {
    return ButtonFactory(TextButtonContainer, this.props);
  }
}

export class OutlineButton extends React.Component {
  render() {
    return ButtonFactory(OutlineButtonContainer, this.props);
  }
}

export class ContainedButton extends React.Component {
  static propTypes = buttonPropTypes();
  render() {
    return ButtonFactory(ContainedButtonContainer, this.props);
  }
}
