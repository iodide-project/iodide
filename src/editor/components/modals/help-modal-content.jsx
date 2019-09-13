import React from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";

import Footer from "../../../shared/components/footer";

const HelpModalContentContainer = styled("div")`
  overflow: auto;
  padding: 20px;
  height: 100%;
`;

const InnerModalContainer = styled("div")`
  display: grid;
  grid-template-rows: [content] 1fr [footer] auto;
  grid-template-columns: 100%;
  min-height: 100%;
`;

const HelpModalContentBody = styled("div")`
  min-height: 100%;
`;

const HelpModalContent = ({ children }) => (
  <HelpModalContentContainer>
    <InnerModalContainer>
      <HelpModalContentBody>{children}</HelpModalContentBody>
      <Footer showIcon={false} />
    </InnerModalContainer>
  </HelpModalContentContainer>
);

HelpModalContent.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default HelpModalContent;
