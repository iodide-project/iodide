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

const MESSAGES = {};
MESSAGES.NOTEBOOK_SAVED = <React.Fragment>Notebook saved.</React.Fragment>;
MESSAGES.ERROR_SAVING_NOTEBOOK = (
  <React.Fragment>Error saving notebook.</React.Fragment>
);
MESSAGES.LOGGED_IN = <React.Fragment>You are now logged in.</React.Fragment>;
MESSAGES.LOGIN_FAILED = <React.Fragment>Login failed.</React.Fragment>;
MESSAGES.LOGGED_OUT = <React.Fragment>You are now logged out.</React.Fragment>;
MESSAGES.LOGOUT_FAILED = <React.Fragment>Logout failed.</React.Fragment>;

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
