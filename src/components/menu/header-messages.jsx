import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { connectionModeIsServer, connectionModeIsStandalone } from '../../tools/server-tools'
import { createNewNotebookOnServer, login } from '../../actions/actions'

export class HeaderMessagesUnconnected extends React.Component {
  static propTypes = {
    message: PropTypes.oneOf(['NEED_TO_LOGIN', 'NEED_TO_MAKE_COPY']),
    login: PropTypes.func.isRequired,
    makeCopy: PropTypes.func.isRequired,
    revisionId: PropTypes.number,
  }

  render() {
    let content;
    switch (this.props.message) {
      case 'STANDALONE_MODE':
        content = (
          <span>
            {"You're viewing this notebook in standalone mode."}
          </span>
        )
        break
      case 'NEED_TO_LOGIN':
        content = (
          <span>
            To save to this server, you need to <a onClick={this.props.login}>login</a>.
          </span>
        )
        break
      case 'NEED_TO_MAKE_COPY':
        content = (
          <span>
            This notebook is owned by another user. {}
            <a onClick={() =>
              this.props.makeCopy(this.props.revisionId)}
            >Make a copy to your account
            </a>.
          </span>
        )
        break
      default:
        return null
    }

    return (
      <div
        className="notebook-header-messages-container"
      >
        {content}
      </div>
    )
  }
}

export function mapStateToProps(state) {
  if (state.viewMode === 'EXPLORE_VIEW') {
    if (connectionModeIsStandalone(state)) {
      return { message: 'STANDALONE_MODE' }
    } else if (state.userData.name === undefined && connectionModeIsServer(state)) {
      return { message: 'NEED_TO_LOGIN' }
    } else if (!state.notebookInfo.user_can_save && connectionModeIsServer(state)) {
      return { message: 'NEED_TO_MAKE_COPY', revisionId: state.notebookInfo.revision_id }
    }
  }

  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    login: () => {
      dispatch(login())
    },
    makeCopy: (revisionId) => {
      dispatch(createNewNotebookOnServer({ forkedFrom: revisionId }))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderMessagesUnconnected)
