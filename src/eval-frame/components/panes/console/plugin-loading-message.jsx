import React from "react";
import styled from "react-emotion";
import ConsoleMessage from "./console-message";

const PluginLoadingMessage = styled("span")`
  font-style: italic;
`;

export default ({ children, loadStatus = "loadingSuccess" }) => (
  <ConsoleMessage level={loadStatus}>
    <PluginLoadingMessage>{children}</PluginLoadingMessage>
  </ConsoleMessage>
);
