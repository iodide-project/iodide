import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

import { storiesOf } from "@storybook/react";

import { ContainedButton } from "../../../../../../shared/components/buttons";

import InProgress from "../in-progress";

const InProgressStories = storiesOf("File sources pane", module);

const Title = ({ children }) => {
  return <h2>{children}</h2>;
};

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 300px;
  align-items: center;
`;

Title.propTypes = {
  children: PropTypes.element
};

const InProgressWrapper = styled.div`
  position: relative;
`;

const SpinningFalse = () => (
  <MainContainer>
    <Title>spinning=false</Title>
    <InProgressWrapper>
      <InProgress spinning={false}>
        <ContainedButton onClick={() => {}}>
          clicking will not work here
        </ContainedButton>
      </InProgress>
    </InProgressWrapper>
  </MainContainer>
);

const SpinningTrue = () => (
  <MainContainer>
    <Title>spinning=false</Title>
    <InProgressWrapper>
      <InProgress spinning>
        <ContainedButton onClick={() => {}}>Click this!!!!</ContainedButton>
      </InProgress>
    </InProgressWrapper>
  </MainContainer>
);

const OnOrOff = () => {
  const [spinning, setSpinning] = useState(false);
  function checkItOut() {
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
    }, 4000);
  }
  return (
    <MainContainer>
      <Title>updates</Title>
      <InProgressWrapper>
        <InProgress spinning={spinning}>
          <ContainedButton onClick={checkItOut}>Click this!!!!</ContainedButton>
        </InProgress>
      </InProgressWrapper>
    </MainContainer>
  );
};

InProgressStories.add("InProgress", () => {
  return (
    <>
      <h1>InProgress</h1>
      <p>
        NOTE: avoid using this component for the time being. It does not
        generalize well.
      </p>
      <SpinningFalse />
      <SpinningTrue />
      <OnOrOff />
    </>
  );
});
