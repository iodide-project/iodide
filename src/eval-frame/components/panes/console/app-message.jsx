import React from "react";
import PropTypes from "prop-types";
import ConsoleMessage from "./console-message";

export const NotebookSaved = () => {
  return <React.Fragment>Notebook saved to server.</React.Fragment>;
};

export const ErrorSavingNotebook = () => {
  return <React.Fragment>Error saving notebook.</React.Fragment>;
};

const messages = {};

messages.NOTEBOOK_SAVED = {};
messages.NOTEBOOK_SAVED.component = NotebookSaved;
messages.NOTEBOOK_SAVED.level = "info";
messages.NOTEBOOK_SAVED.useSymbol = true;

messages.ERROR_SAVING_NOTEBOOK = {};
messages.ERROR_SAVING_NOTEBOOK.component = ErrorSavingNotebook;
messages.ERROR_SAVING_NOTEBOOK.level = "error";
messages.ERROR_SAVING_NOTEBOOK.useSymbol = false;

export default class AppMessage extends React.Component {
  static propTypes = {
    messageType: PropTypes.string.isRequired
  };
  render() {
    const { messageType } = this.props;
    const Inner = messages[messageType].component;
    const { level } = messages[messageType];
    return (
      <ConsoleMessage level={level}>
        <Inner />
      </ConsoleMessage>
    );
  }
}
