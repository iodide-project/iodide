import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

import ConsoleContainer from "./console-container";
import ConsoleGutter from "../../console-gutter";
import levels from "./log-levels";

const MessageContainer = styled(ConsoleContainer)`
  overflow: auto;
  margin-bottom: 0px;
  margin-top: 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const MessageBody = styled("div")`
  margin: auto;
  margin-left: 0;
  padding-top: 5px;
  padding-bottom: 5px;
  min-height: 20px;
  max-width: calc(100% - 5px);
  overflow-x: hidden;
`;

const ConsoleMessage = ({ children, level }) => {
  const { backgroundColor, textColor, icon } = levels[level];
  return (
    <MessageContainer
      backgroundColor={backgroundColor}
      textColor={textColor || "black"}
    >
      <ConsoleGutter>{icon}</ConsoleGutter>
      <MessageBody>{children}</MessageBody>
    </MessageContainer>
  );
};

ConsoleMessage.propTypes = {
  level: PropTypes.oneOf(Object.keys(levels)).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default ConsoleMessage;
