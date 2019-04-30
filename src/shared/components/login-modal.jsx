import React from "react";
import PropTypes from "prop-types";
import Modal from "./modal";
import ModalContent from "./modal-content";
import { ContainedButton } from "./buttons";

export default class LoginModal extends React.Component {
  static propTypes = {
    login: PropTypes.func,
    visible: PropTypes.bool,
    onClose: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
  }

  login() {
    this.props.login();
    this.props.onClose();
  }

  render() {
    return (
      <Modal visible={this.props.visible} onClose={this.props.onClose}>
        <ModalContent>
          <p>
            When you log in to iodide via{" "}
            <a href="https://github.com/">GitHub</a>, Mozilla (that’s us) gets
            access to a small amount of information in your Github account (such
            as your user name and profile photo). We handle your data according
            to our{" "}
            <a href="https://www.mozilla.org/privacy/websites/">
              Privacy Policy
            </a>
            .
          </p>
          <p>
            Iodide.io is a coding commons for open data science, and documents
            created on Iodide.io are publicly visible.{" "}
            <strong>
              Please ensure that your projects do not include sensitive data or
              security secrets.
            </strong>
          </p>
          <p>
            When you create or fork a notebook, the open source{" "}
            <a href="https://creativecommons.org/licenses/by-sa/3.0/">
              Commons Attribution-Share Alike license
            </a>{" "}
            applies to your content. Your notebooks are associated with your
            account.
          </p>
          <p>
            When you sign in, you agree to our{" "}
            <a href="https://www.mozilla.org/about/legal/terms/mozilla">
              Terms of Service
            </a>
            .
          </p>
          <center>
            <ContainedButton
              buttonColor="green"
              buttonHoverColor="#050"
              onClick={this.login}
            >
              <i className="fa fa-github" />
              &nbsp;Login via Github
            </ContainedButton>
          </center>
        </ModalContent>
      </Modal>
    );
  }
}
