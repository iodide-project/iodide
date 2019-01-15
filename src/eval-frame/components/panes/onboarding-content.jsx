import React from "react";
import styled from "react-emotion";

import EmptyPaneContents from "./empty-pane-contents";

const color = props => (props.light ? "darkgray" : "black");
const lighterColor = props => (props.light ? "gainsboro" : "darkgray");
const ONBOARDING_SETTINGS = {
  gapSize: 15,
  elemGap: 5
};

const OnboardingLede = styled("div")`
  margin-top: ${ONBOARDING_SETTINGS.gapSize}px;
  margin-bottom: ${ONBOARDING_SETTINGS.gapSize}px;
`;

const ThreeElements = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: ${ONBOARDING_SETTINGS.gapSize * 2}px;
`;

const OnboardingHeader = styled("h1")`
  font-weight: 300;
  margin-bottom: ${ONBOARDING_SETTINGS.gapSize}px;
`;
const Element = styled("div")`
  border: 1px solid var(--onboarding-lightercolor);
  border-radius: 5px;
  margin-top: ${ONBOARDING_SETTINGS.gapSize}px;
`;

const ElementTitle = styled("h2")`
  font-weight: 300;
  margin: 0;
  padding: ${ONBOARDING_SETTINGS.elemGap * 2}px
    ${ONBOARDING_SETTINGS.elemGap * 2}px ${ONBOARDING_SETTINGS.elemGap}px
    ${ONBOARDING_SETTINGS.elemGap * 3}px;
  border-bottom: 1px solid grainsboro;
  margin-bottom: ${ONBOARDING_SETTINGS.elemGap}px;
`;
const ElementBody = styled("div")`
  padding: ${ONBOARDING_SETTINGS.elemGap * 3}px;
  padding-top: ${ONBOARDING_SETTINGS.elemGap}px;
`;

const OnboardingLink = styled("a")`
  text-decoration: none;
  display: block;
  color: var(--onboarding-color);

  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const OnboardingContentContainer = styled(EmptyPaneContents)`
  font-size: 14px;
  font-weight: normal;
  --onboarding-color: ${color};
  --onboarding-lightercolor: ${lighterColor};
  color: var(--onboarding-color);
`;

export default class OnboardingContent extends React.Component {
  render() {
    return (
      <OnboardingContentContainer light>
        <OnboardingHeader>Welcome to Iodide!</OnboardingHeader>
        <OnboardingLede>Here are three ways to get started.</OnboardingLede>
        <ThreeElements>
          <Element key="examples">
            <ElementTitle>Fork an Example</ElementTitle>
            <ElementBody>
              <OnboardingLink>Pyodide starter</OnboardingLink>
              <OnboardingLink>Dashboard starter</OnboardingLink>
              <OnboardingLink>Examples Gallery</OnboardingLink>
            </ElementBody>
          </Element>
          <Element key="tutorials">
            <ElementTitle>Read a Tutorial</ElementTitle>
            <ElementBody>
              <OnboardingLink href="https://extremely-alpha.iodide.io/notebooks/154/">
                A Tour Through Iodide
              </OnboardingLink>
              <OnboardingLink>How to use other libraries</OnboardingLink>
              <OnboardingLink href="https://extremely-alpha.iodide.io/notebooks/151/">
                Getting Started with Python
              </OnboardingLink>
            </ElementBody>
          </Element>
          <Element key="docs">
            <ElementTitle>Check the Docs</ElementTitle>
            <ElementBody>
              <OnboardingLink href="https://iodide.io/docs/jsmd/">
                JSMD format
              </OnboardingLink>
              <OnboardingLink href="https://iodide.io/docs/api/">
                Iodide API
              </OnboardingLink>
              <OnboardingLink href="">Pyodide API</OnboardingLink>
            </ElementBody>
          </Element>
        </ThreeElements>
      </OnboardingContentContainer>
    );
  }
}
