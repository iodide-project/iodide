import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { connectionModeIsServer, connectionModeIsStandalone } from '../../tools/server-tools'
import {
  createNewNotebookOnServer,
  discardAutosave,
  loadAutosave,
  login,
} from '../../actions/actions'

export class HeaderMessagesUnconnected extends React.Component {
  static propTypes = {
    message: PropTypes.oneOf(['HAS_PREVIOUS_AUTOSAVE', 'STANDALONE_MODE',
      'NEED_TO_LOGIN', 'NEED_TO_MAKE_COPY']),
    loadAutosave: PropTypes.func.isRequired,
    discardAutosave: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    makeCopy: PropTypes.func.isRequired,
    revisionId: PropTypes.number,
  }

  render() {
    let content;
    switch (this.props.message) {
      case 'HAS_PREVIOUS_AUTOSAVE':
        content = (
          <span>
            {
              this.props.connectionModeIsServer ?
                'You have made changes to this notebook that are only saved locally.' :
                'Modifications to notebook detected in browser\'s local storage.'
            }
            &nbsp;
            <a onClick={this.props.loadAutosave}>
              Restore
            </a>
            &nbsp;or&nbsp;
            <a onClick={this.props.discardAutosave}>
              discard
            </a>.
          </span>
        )
        break
      case 'STANDALONE_MODE':
        content = (
          <span>
            {"You're viewing this notebook in standalone mode. Changes will be cached in your browser's local storage, but will not be otherwise persisted."}
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
    if (state.hasPreviousAutoSave) {
      return {
        message: 'HAS_PREVIOUS_AUTOSAVE',
        connectionModeIsServer: connectionModeIsServer(state),
      }
    } else if (connectionModeIsStandalone(state)) {
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
    discardAutosave: () => {
      dispatch(discardAutosave())
    },
    loadAutosave: () => {
      dispatch(loadAutosave())
    },
    makeCopy: (revisionId) => {
      dispatch(createNewNotebookOnServer({ forkedFrom: revisionId }))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderMessagesUnconnected)
