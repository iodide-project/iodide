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
    this.props.onClose()
  }

  render() {
    return (
      <Modal visible={this.props.visible} onClose={this.props.onClose}>
        <ModalContent>
          <p>When you log in to iodide via <a href="https://github.com/">GitHub</a>,
            Mozilla (that’s us) gets access to a small amount of information in your
            Github account (such as your user name and profile photo). We handle your data
            according to our <a href="https://www.mozilla.org/privacy/websites/">Privacy Policy</a>.
          </p>
          <p>
            When you create or fork a notebook, the open source&nbsp;
            <a href="https://creativecommons.org/licenses/by-sa/3.0/">
              Commons Attribution-Share Alike license
            </a>&nbsp;
            applies to your content. Your notebooks are associated with your account.
          </p>
          <p>
            When you sign in, you agree to our <a href="https://www.mozilla.org/about/legal/terms/mozilla">Terms of Service</a>.
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
