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
    // i think using index as key is ok here, but be careful!! see:
    // https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318
    const messageDivs = this.props.appMessages
      .map((msg, i) => (<div
        className="app-info-message"
        key={`msg-${i}`} // eslint-disable-line
        dangerouslySetInnerHTML={{__html: msg}} // eslint-disable-line
      />))
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
