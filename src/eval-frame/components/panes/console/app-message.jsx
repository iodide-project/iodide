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
messages.NOTEBOOK_SAVED.MessageBody = NotebookSaved;
messages.NOTEBOOK_SAVED.level = "info";
messages.NOTEBOOK_SAVED.useSymbol = true;

messages.ERROR_SAVING_NOTEBOOK = {};
messages.ERROR_SAVING_NOTEBOOK.MessageBody = ErrorSavingNotebook;
messages.ERROR_SAVING_NOTEBOOK.level = "error";
messages.ERROR_SAVING_NOTEBOOK.useSymbol = false;

const mapToProps = messageType => {
  return messages[messageType];
};

const AppMessage = ({ messageType }) => {
  const { level, MessageBody } = mapToProps(messageType);
  return (
    <ConsoleMessage level={level}>
      <MessageBody />
    </ConsoleMessage>
  );
};

AppMessage.propTypes = {
  messageType: PropTypes.oneOf(Object.keys(messages)).isRequired
};

export default AppMessage;
