import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import DoubleChevronIcon from "../../double-chevron-icon";
import BaseIcon from "../../base-icon";
import ConsoleContainer from "./console-container";
import ConsoleGutter from "../../console-gutter";
import THEME from "../../../../shared/theme";

const DoubleChevron = styled(BaseIcon(DoubleChevronIcon))`
  margin: 0;
  opacity: 0.3;
`;

const inputBackgroundColor = (opacity = 1) => `rgba(251,251,253,${opacity})`;

const InputContainer = styled(ConsoleContainer)`
  overflow: auto;
  margin-bottom: 0px;
  margin-top: 0px;
  background-color: ${inputBackgroundColor()};
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const InputBody = styled("pre")`
  padding: 0;
  margin: 0;
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: ${THEME.client.console.fontSize};
  line-height: ${THEME.client.console.lineHeight};
  font-family: monospace;
  grid-column: 2 / 4;
  opacity: 0.7;
`;

InputBody.propTypes = {
  language: PropTypes.string
};

const LanguageLabel = styled("span")`
  font-family: sans-serif;
  border-left: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom-left-radius: 3px;
  color: rgba(0, 0, 0, 0.6);
  background-color: ${inputBackgroundColor(0.9)};
  padding: 0px 4px;
  float: right;
  font-size: 10px;
  transform: translate(0px, -5px);
`;

const HistoryInputItem = ({ language, children }) => {
  return (
    <InputContainer>
      <ConsoleGutter>
        <DoubleChevron />
      </ConsoleGutter>
      <InputBody>
        <LanguageLabel>{language}</LanguageLabel>
        {children.trim()}
      </InputBody>
    </InputContainer>
  );
};
HistoryInputItem.propTypes = {
  language: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};
export default HistoryInputItem;
