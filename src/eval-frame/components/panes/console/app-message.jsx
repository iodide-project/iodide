import React from "react";
import styled from "react-emotion";
import LogoMarkIcon from "../../../../shared/components/logo/logo-mark";

import ConsoleContainer from "./console-container";
import ConsoleMessage from "./console-message";

// const LogoMark = BaseIcon(LogoMarkIcon);
const LogoMark = styled(LogoMarkIcon)`
  opacity: 0.5;
`;

export const NotebookSaved = () => {
  return (
    <React.Fragment>
      Updated Notebook
      <br />
      Notebook Saved
    </React.Fragment>
  );
};

export const ErrorSavingNotebook = () => {
  return <React.Fragment>Error saving notebook.</React.Fragment>;
};

const messages = {};

messages.NOTEBOOK_SAVED = {};
messages.NOTEBOOK_SAVED.component = NotebookSaved;
messages.NOTEBOOK_SAVED.level = "log";
messages.NOTEBOOK_SAVED.useSymbol = true;

messages.ERROR_SAVING_NOTEBOOK = {};
messages.ERROR_SAVING_NOTEBOOK.component = undefined;
messages.ERROR_SAVING_NOTEBOOK.level = "error";
messages.ERROR_SAVING_NOTEBOOK.useSymbol = false;

export default class AppMessage extends React.Component {
  render() {
    const Inner = messages[this.props.children].component;
    const { level, useSymbol } = messages[this.props.children];
    return (
      <ConsoleMessage
        level={level}
        symbol={useSymbol ? <LogoMark width={15} /> : undefined}
      >
        <Inner />
      </ConsoleMessage>
    );
  }
}
