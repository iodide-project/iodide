import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import SidePane from './side-pane'

// import DeclaredVariables from '../declared-variables'
import tasks from '../../actions/task-definitions'

export class AppInfoPaneUnconnected extends React.Component {
  static propTypes = {
    appMessages: PropTypes.array,
  }
  render() {
    /* eslint-disable */
    const messageDivs = this.props.appMessages
      .map((msg, i) => (
        <div
          className="app-info-message"
          key={`msg-${msg.when.toString()}`}
        >
          <div dangerouslySetInnerHTML={{ __html: msg.details }} />
          <div className='msg-when'>{msg.when}</div>
        </div>
      ))
    /* eslint-enable */
    return (
      <SidePane task={tasks.toggleAppInfoPane} title="App info" openOnMode="_APP_INFO">
        {messageDivs}
      </SidePane>
    )
  }
}

function mapStateToProps(state) {
  return {
    appMessages: state.appMessages,
    sidePaneMode: state.sidePaneMode,
  }
}

export default connect(mapStateToProps)(AppInfoPaneUnconnected)
