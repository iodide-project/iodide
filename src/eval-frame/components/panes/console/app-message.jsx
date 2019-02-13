import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";

// this will get deprecated once the rest of the
// console styling hits.

const AppMessageContainer = styled("div")`
  border-bottom: 1px solid gainsboro;
`;

const AppMessageBody = styled("div")`
  padding: 5px;
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
    <AppMessageContainer>
      <AppMessageBody>{message}</AppMessageBody>
    </AppMessageContainer>
  );
};

AppMessage.propTypes = {
  messageType: PropTypes.string.isRequired
};

export default AppMessage;
