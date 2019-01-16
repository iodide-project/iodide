import React from "react";
import styled from "react-emotion";

import EmptyPaneContents from "./empty-pane-contents";

const elementColor = props => (props.fainter ? "gray" : "rgba(0,0,0,.6)");
const color = props => (props.fainter ? "darkgray" : "rgba(0,0,0,.8)");
const lighterColor = props => (props.fainter ? "gainsboro" : "darkgray");

const ONBOARDING_SETTINGS = {
  gapSize: 15,
  elemGap: 5
};

const OnboardingContentContainer = styled(EmptyPaneContents)`
  font-size: 14px;
  font-weight: normal;
  --onboarding-color: ${color};
  --onboarding-lightercolor: ${lighterColor};
  --element-border: gainsboro;
  --element-color: ${elementColor};
  color: var(--onboarding-color);
`;

const OnboardingLede = styled("div")`
  margin-top: ${ONBOARDING_SETTINGS.gapSize}px;
  margin-bottom: ${ONBOARDING_SETTINGS.gapSize * 2}px;
`;

const ThreeElements = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: ${ONBOARDING_SETTINGS.gapSize * 2}px;
  margin-top: ${ONBOARDING_SETTINGS.gapSize}px;
  margin-bottom: ${ONBOARDING_SETTINGS.gapSize * 2}px;
`;

const OnboardingHeader = styled("h1")`
  font-weight: 300;
  margin-bottom: ${ONBOARDING_SETTINGS.gapSize}px;
`;
const Element = styled("div")`
  border: 1px solid var(--element-border);
  border-radius: 5px;
  background: linear-gradient(to right, rgb(248, 243, 248), rgb(250, 248, 250));
  color: var(--element-color);
  transition: 300ms;

  : hover {
    box-shadow: 2px 2px 0px rgba(104, 40, 96, 0.3);
  }
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
  color: var(--element-color);

  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const AdditionalOnboarding = styled("div")`
  margin-top: ${ONBOARDING_SETTINGS.gapSize}px;
  margin-bottom: ${ONBOARDING_SETTINGS.gapSize}px;
`;

export default class OnboardingContent extends React.Component {
  render() {
    return (
      <OnboardingContentContainer fainter={this.props.fainter}>
        <OnboardingHeader>Welcome to Iodide!</OnboardingHeader>
        <OnboardingLede>
          {this.props.lede || "Here are three ways to get started."}
        </OnboardingLede>
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
        <AdditionalOnboarding>{this.props.children}</AdditionalOnboarding>
      </OnboardingContentContainer>
    );
  }
}
