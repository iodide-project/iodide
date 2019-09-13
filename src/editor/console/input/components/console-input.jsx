import React from "react";
import styled from "@emotion/styled";

import DoubleChevron from "../../double-chevron-icon";
import ConsoleGutter from "../../console-gutter";
import BaseIcon from "../../base-icon";

import ConsoleInputField from "./console-input-field";
import ConsoleLanguageMenu from "./console-language-menu";

const DoubleChevronIcon = styled(BaseIcon(DoubleChevron))`
  opacity: 0.5;
  transform: translateY(-2px);
`;

const ConsoleInputContainer = styled("div")`
  display: flex;
  border-top: 1px solid #ddd;
`;

const ConsoleInput = () => {
  return (
    <ConsoleInputContainer>
      <ConsoleGutter>
        <DoubleChevronIcon />
      </ConsoleGutter>
      <ConsoleInputField />
      <ConsoleLanguageMenu />
    </ConsoleInputContainer>
  );
};

export default ConsoleInput;
