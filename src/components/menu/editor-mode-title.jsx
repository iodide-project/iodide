import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import Helmet from "react-helmet";

import { connect } from "react-redux";

import tasks from "../../actions/task-definitions";

const TitleContainer = styled("div")``;

const InputElement = styled("input")`
  font-family: "Open Sans";
  font-size: 14px;
  border: none;
  outline: none;
  width: 100%;
  margin: auto;
  text-align: center;
  color: ${({ isUntitled }) => (isUntitled ? "lightgray" : "white")};
  background-color: transparent;

  :focus {
    font-size: 20px;
  }
`;

export class TitleUnconnected extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    textColor: PropTypes.string,
    hoverColor: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.getTitle = this.getTitle.bind(this);
  }

  getTitle() {
    return `${this.props.title || "New Notebook"} - Iodide`;
  }

  render() {
    const elem = (
      <TitleContainer>
        <Helmet title={this.getTitle()} />
        <InputElement
          isUntitled={this.props.isUntitled}
          value={this.props.title || ""}
          placeholder="new notebook"
          onChange={evt => {
            tasks.changeTitle.callback(evt.target.value);
          }}
        />
      </TitleContainer>
    );
    return elem;
  }
}

function mapStateToProps(state) {
  return {
    title: state.title,
    additionalContainerClasses: "",
    isUntitled: state.title === undefined
  };
}

export default connect(mapStateToProps)(TitleUnconnected);
