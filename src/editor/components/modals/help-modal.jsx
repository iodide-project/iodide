import React from "react";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { ModalContainer } from "./modal-container";
import HelpModalContent from "./help-modal-content";

import KeyboardShortcutList from "./keyboard-shortcut-list";
import OnboardingContent from "../../../shared/components/onboarding-content";
import AboutIodide from "./about-iodide";
import FeaturedNotebooks from "../../../shared/components/featured-notebooks";

import THEME from "../../../shared/theme";

const MoreResources = () => (
  <HelpModalContent>
    <h2>Documentation</h2>
    <p>
      Visit the <a href="https://docs.iodide.io/">Iodide Documentation</a>.
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
        {value === 1 && <KeyboardShortcutList />}
        {value === 2 && <MoreResources />}
        {value === 3 && <AboutIodide />}
      </ModalContainer>
    );
  }
}
