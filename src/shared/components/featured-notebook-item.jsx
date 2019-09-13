import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import Element from "./three-set/element";

const NotebookDisplayContainer = styled(Element.withComponent("a"))`
  color: black;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  text-decoration: none;
  background: linear-gradient(65deg, #f6f8fa, rgb(250, 250, 250));
  transition: 100ms;

  :hover {
    text-decoration: none;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 1px 1px 18px rgba(0, 0, 0, 0.15);
  }
`;

const InnerDisplayContainer = styled("div")`
  padding: 15px;
  font-size: 13px;
  line-height: 1.3em;
`;

const NotebookDisplayImg = styled("img")`
  display: block;
  outline: 1px solid rgba(0, 0, 0, 0.05);
  margin: auto;
  margin-bottom: 15px;
`;

const NotebookDisplayTitle = styled("h3")`
  margin: 0px;
  padding-top: 0px;
  padding-bottom: 10px;
  min-height: 50px;
`;

export default class NotebookDisplayItem extends React.Component {
  static propTypes = {
    imageSource: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired
  };
  render() {
    return (
      <NotebookDisplayContainer href={this.props.href}>
        <InnerDisplayContainer>
          <NotebookDisplayImg
            width="100%"
            src={this.props.imageSource}
            alt={this.props.title}
          />
          <NotebookDisplayTitle>{this.props.title}</NotebookDisplayTitle>
          {this.props.description}
        </InnerDisplayContainer>
      </NotebookDisplayContainer>
    );
  }
}
