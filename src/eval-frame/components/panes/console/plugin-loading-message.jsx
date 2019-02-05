import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import ConsoleMessage from "./console-message";

const PluginLoadingMessageBody = styled("span")`
  font-style: italic;
`;

const PluginLoadingMessage = ({ children, loadStatus = "loadingSuccess" }) => (
  <ConsoleMessage level={loadStatus}>
    <PluginLoadingMessageBody>{children}</PluginLoadingMessageBody>
  </ConsoleMessage>
);

PluginLoadingMessage.propTypes = {
  loadStatus: PropTypes.string
};

export default PluginLoadingMessage;
