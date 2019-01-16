/* global IODIDE_VERSION */

import React from "react";
import styled from "react-emotion";
import HelpModalContent from "./help-modal-content";
import ThreeElements from "../../shared/components/three-set/three-elements";
import Element, {
  ElementTitle
} from "../../shared/components/three-set/element";

const IodideLogoMarkContainer = styled("svg")`
  margin: auto;
  display: block;
`;
const IodideLogoMark = () => (
  <IodideLogoMarkContainer
    width="100"
    viewBox="0 0 386 386"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="15"
      y="15"
      width="356"
      height="356"
      rx="30"
      fill="white"
      stroke="#4f3554"
      strokeWidth="30"
      strokeMiterlimit="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M240.6 326H141.4V294.4H173V97.6H141.4V66H240.6V97.6H209.4V294.4H240.6V326Z"
      fill="#4f3554"
    />
    <line
      x1="265"
      y1="112.5"
      x2="329"
      y2="112.5"
      stroke="#4f3554"
      strokeWidth="27"
      strokeLinejoin="round"
    />
  </IodideLogoMarkContainer>
);

const AboutContentContainer = styled("div")`
  width: 700px;
  margin: auto;
  margin-top: 40px;
`;

const AboutContentHeader = styled("h1")`
  font-weight: 900;
  text-align: center;
  color: #4f3554;
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 30px;
`;

const IodideTitle = styled("div")`
  font-family: "Zilla Slab";
  sub {
    font-weight: 100;
    font-size: 0.7em;
  }
`;
const IodideVersion = styled("div")`
  opacity: 0.7;
  font-weight: 100;
  font-size: 0.7em;
  margin-top: -10px;
`;

const AboutThreeElements = styled(ThreeElements)`
  margin-bottom: 30px;
`;

const AboutElement = styled(Element.withComponent("a"))`
  display: flex;
  text-decoration: none;
  padding: 15px;
  align-items: center;
  border: 1px solid gainsboro;
  justify-content: center;
`;

const AboutElementTitle = styled(ElementTitle)`
  text-align: center;
  padding: 0;
  font-weight: bold;
`;

const Channels = styled("div")`
  color: darkslategray;
  text-align: center;
  a {
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export default () => (
  <HelpModalContent>
    <AboutContentContainer>
      <IodideLogoMark />
      <AboutContentHeader>
        <IodideTitle>
          Iodide<sub>α</sub> <IodideVersion>{IODIDE_VERSION}</IodideVersion>
        </IodideTitle>
      </AboutContentHeader>
      <AboutThreeElements>
        <AboutElement href="https://github.com/iodide-project/iodide">
          <AboutElementTitle>Visit Our Repository</AboutElementTitle>
        </AboutElement>
        <AboutElement href="https://github.com/iodide-project/iodide/issues">
          <AboutElementTitle>File an Issue or Bug</AboutElementTitle>
        </AboutElement>
        <AboutElement href="https://github.com/iodide-project/iodide/blob/master/CONTRIBUTING.md">
          <AboutElementTitle>Learn How to Contribute</AboutElementTitle>
        </AboutElement>
      </AboutThreeElements>
      <Channels>
        Chat on Gitter:{" "}
        <a href="https://gitter.im/iodide-project/iodide">#iodide</a>
      </Channels>
    </AboutContentContainer>
  </HelpModalContent>
);
