import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'

import { createNewNotebookOnServer, login } from '../../actions/actions'

export class HeaderMessagesUnconnected extends React.Component {
  static propTypes = {
    message: PropTypes.oneOf(['NEED_TO_LOGIN', 'NEED_TO_MAKE_COPY']),
    login: PropTypes.func.isRequired,
    makeCopy: PropTypes.func.isRequired,
  }

  render() {
    let content;

    switch (this.props.message) {
      case 'NEED_TO_LOGIN':
        content = (
          <span>
            To save to this server, you need to <Button onClick={this.props.login}>login</Button>
          </span>
        )
        break
      case 'NEED_TO_MAKE_COPY':
        content = (
          <span>
            This notebook is owned by another user.
            <Button onClick={this.props.makeCopy}>Make a copy to your account</Button>
          </span>
        )
        break
      default:
        return null
    }

    return (
      <div
        className="notebook-header-messages-container"
        style={{ display: this.props.message ? 'block' : 'none' }}
      >
        {content}
      </div>
    )
  }
}

export function mapStateToProps(state) {
  if (state.viewMode === 'EXPLORE_VIEW') {
    if (state.userData.name === undefined) {
      return { message: 'NEED_TO_LOGIN' }
    } else if (!state.notebookInfo.user_can_save) {
      return { message: 'NEED_TO_MAKE_COPY' }
    }
  }

  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    login: () => {
      dispatch(login())
    },
    makeCopy: () => {
      dispatch(createNewNotebookOnServer())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderMessagesUnconnected)
