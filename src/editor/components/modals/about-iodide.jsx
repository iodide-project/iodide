import React from "react";
import styled from "@emotion/styled";
import HelpModalContent from "./help-modal-content";
import LogoMark from "../../../shared/components/logo/logo-mark";
import ThreeElements from "../../../shared/components/three-set/three-elements";
import Element, {
  ElementTitle
} from "../../../shared/components/three-set/element";

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
    font-size: 0.65em;
    position: relative;
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

const MiddleSection = styled("div")`
  margin-top: 10vh;
`;

export default () => (
  <HelpModalContent>
    <AboutContentContainer>
      <LogoMark />
      <AboutContentHeader>
        <IodideTitle>
          Iodide<sub>α</sub>{" "}
          <IodideVersion>{process.env.IODIDE_VERSION}</IodideVersion>
        </IodideTitle>
      </AboutContentHeader>
      <MiddleSection>
        <AboutThreeElements>
          <AboutElement href="https://github.com/iodide-project/iodide">
            <AboutElementTitle>Visit Our Repository</AboutElementTitle>
          </AboutElement>
          <AboutElement href="https://github.com/iodide-project/iodide/issues">
            <AboutElementTitle>File an Issue or Bug</AboutElementTitle>
          </AboutElement>
          <AboutElement href="https://iodide-project.github.io/docs/contributing/">
            <AboutElementTitle>Learn How to Contribute</AboutElementTitle>
          </AboutElement>
        </AboutThreeElements>
        <Channels>
          Chat on Gitter:{" "}
          <a href="https://gitter.im/iodide-project/iodide">#iodide</a>
        </Channels>
      </MiddleSection>
    </AboutContentContainer>
  </HelpModalContent>
);
