import React from 'react'
import Modal from './components/modal'
import ModalContent from './components/modal-content'
import { ContainedButton } from './components/buttons'

export default class LoginModal extends React.Component {
  constructor(props) {
    super(props)
    this.login = this.login.bind(this)
  }

  login() {
    this.props.login()
  }

  render() {
    return (
      <Modal visible={this.props.visible} onClose={this.props.onClose}>
        <ModalContent>
          <p>
            When you log in to iodide via <a href="https://github.com/">GitHub</a>,
            you will be granting us access to a small amount of information about
            your account (user name, profile photo). Your information will not be
            shared with or sold to third parties.
          </p>
          <p>
            Any notebooks you create or fork will be associated with your account.
            By creating and sharing notebooks on our site, you are implicitly
            granting others permission to share and reuse your work under the&nbsp;
            <a href="http://creativecommons.org/licenses/by-sa/2.5/" target="_blank" rel="noopener noreferrer">
              Creative Commons Attribution Sharealike license
            </a>.
          </p>
          <center>
            <ContainedButton
              buttonColor="green"
              buttonHoverColor="#050"
              onClick={this.login}
            >
              <i className="fa fa-github" />&nbsp;Login via Github
            </ContainedButton>
          </center>
        </ModalContent>
      </Modal>
    )
  }
}
