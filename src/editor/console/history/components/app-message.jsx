import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import ConsoleMessage from "./console-message";

const AppMessageBody = styled("div")`
  grid-column: body;
  color: rgba(0, 0, 0, 0.8);
`;

const MESSAGES = {
  NOTEBOOK_SAVED: "Notebook saved.",
  ERROR_SAVING_NOTEBOOK: "Error saving notebook.",
  LOGGED_IN: "You are now logged in.",
  LOGGED_OUT: "You are now logged out.",
  LOGIN_FAILED: "Login failed.",
  LOGOUT_FAILED: "Logout failed."
};

const AppMessage = ({ messageType }) => {
  const message = MESSAGES[messageType];
  return (
    <ConsoleMessage level="LOG">
      <AppMessageBody>{message}</AppMessageBody>
    </ConsoleMessage>
  );
};

AppMessage.propTypes = {
  messageType: PropTypes.string.isRequired
};

export default AppMessage;
