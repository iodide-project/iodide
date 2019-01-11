import React from "react";
import styled from "react-emotion";

const NotebookDisplayContainer = styled("a")`
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
    background: linear-gradient(20deg, rgb(250, 250, 250), rgb(245, 245, 245));
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
  margin-bottom: 15px;
`;

const NotebookDisplayTitle = styled("h3")`
  margin: 0px;
  padding-top: 0px;
  padding-bottom: 10px;
  min-height: 50px;
`;

export default class NotebookDisplayItem extends React.Component {
  render() {
    return (
      <NotebookDisplayContainer href={this.props.href}>
        <InnerDisplayContainer>
          <NotebookDisplayImg
            width={250}
            height={250}
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
