import React from "react";
import styled from "react-emotion";
import Footer from "../../server/components/footer";

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

export default ({ children }) => (
  <HelpModalContentContainer>
    <InnerModalContainer>
      <HelpModalContentBody>{children}</HelpModalContentBody>
      <Footer showIcon={false} />
    </InnerModalContainer>
  </HelpModalContentContainer>
);
