import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import HelpModalContent from "./help-modal-content";

import KeyboardShortcutList from "./keyboard-shortcut-list";
import OnboardingContent from "../../eval-frame/components/panes/onboarding-content";
import AboutIodide from "./about-iodide";
import FeaturedNotebooks from "../../shared/components/featured-notebooks";
import tasks from "../../actions/task-definitions";

import THEME from "../../shared/theme";

const ModalContainer = styled("div")`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 80%;
  width: 60%;
  min-width: 700px;
  background: white;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.5);
  flex-direction: column;
  display: flex;

  @media (max-width: 1400px) {
    width: 80%;
  }
`;

const MoreResources = () => (
  <HelpModalContent>
    <h2>Documentation</h2>
    <p>
      Visit the <a href="https://iodide.io/docs">Iodide Documentation</a>.
    </p>
  </HelpModalContent>
);

const Onboarding = () => (
  <HelpModalContent>
    <OnboardingContent />
    <h2>Try one of these examples</h2>
    <FeaturedNotebooks />
  </HelpModalContent>
);

export default class HelpModal extends React.Component {
  static propTypes = {
    tasks: PropTypes.object
  };

  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <ModalContainer className="help-modal">
        <AppBar
          position="static"
          style={{
            background: THEME.clientModal.background
          }}
        >
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Getting Started" />
            <Tab label="Keyboard Shortcuts" />
            <Tab label="More Resources" />
            <Tab label="About Iodide" />
          </Tabs>
        </AppBar>
        {value === 0 && <Onboarding />}
        {value === 1 && <KeyboardShortcutList tasks={tasks} />}
        {value === 2 && <MoreResources />}
        {value === 3 && <AboutIodide />}
      </ModalContainer>
    );
  }
}
