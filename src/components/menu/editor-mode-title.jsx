import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import Helmet from "react-helmet";

import { connect } from "react-redux";

import { changePageTitle } from "../../actions/actions";

const TitleContainer = styled("div")``;

const InputElement = styled("input")`
  font-family: "Open Sans";
  font-size: 14px;
  border: none;
  outline: none;
  width: 100%;
  margin: auto;
  text-align: center;
  color: ${props => props.titleColor};
  background-color: transparent;

  :focus {
    font-size: 20px;
  }
`;

export class TitleUnconnected extends React.Component {
  static propTypes = {
    notebookTitle: PropTypes.string,
    pageTitle: PropTypes.string,
    titleColor: PropTypes.string,
    changePageTitle: PropTypes.func
  };

  render() {
    const elem = (
      <TitleContainer>
        <Helmet title={this.props.pageTitle} />
        <InputElement
          titleColor={this.props.titleColor}
          value={this.props.notebookTitle}
          placeholder="new notebook"
          onChange={evt => {
            this.props.changePageTitle(evt.target.value);
          }}
        />
      </TitleContainer>
    );
    return elem;
  }
}

export function mapStateToProps(state) {
  return {
    notebookTitle: state.title || "",
    pageTitle: `${state.title || "New Notebook"} - Iodide`,
    titleColor: state.title === undefined ? "lightgray" : "white"
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    changePageTitle: title => dispatch(changePageTitle(title))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TitleUnconnected);
