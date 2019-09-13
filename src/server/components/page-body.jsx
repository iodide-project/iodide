import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import Footer from "../../shared/components/footer";
import { sharedProperties } from "../style/base";

const PageBodyContainer = styled("div")`
  margin: auto;
  margin-top: 40px;
  width: ${sharedProperties.pageWidth}px;
  display: flex;
  min-height: calc(100vh - 100px);
  flex-direction: column;
`;

const BodyContent = styled("div")`
  flex: 1;
`;

export default class PageBody extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.array
    ])
  };
  render() {
    return (
      <PageBodyContainer>
        <BodyContent>{this.props.children}</BodyContent>
        <Footer />
      </PageBodyContainer>
    );
  }
}
