import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { connect } from "react-redux";

import { updateAutosave } from "../../actions/autosave-actions";
import { updateTitle } from "../../actions/notebook-actions";

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
    updateTitle: PropTypes.func
  };

  render() {
    const elem = (
      <TitleContainer>
        <HelmetProvider>
          <Helmet title={this.props.pageTitle} />
        </HelmetProvider>
        <InputElement
          titleColor={this.props.titleColor}
          value={this.props.notebookTitle}
          placeholder="new notebook"
          onChange={evt => {
            this.props.updateTitle(evt.target.value);
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
    updateTitle: title => {
      dispatch(updateTitle(title));
      dispatch(updateAutosave());
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(TitleUnconnected);
