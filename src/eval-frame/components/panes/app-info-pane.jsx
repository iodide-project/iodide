import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import EmptyPaneContents from './empty-pane-contents'

export class AppInfoPaneUnconnected extends React.Component {
  static propTypes = {
    appMessages: PropTypes.array,
  }
  render() {
    /* eslint-disable */
    let messageDivs = this.props.appMessages
      .map((msg, i) => (
        <div
          className="app-info-message"
          key={`msg-${msg.id}`}
        >
          <div className='app-message-details' dangerouslySetInnerHTML={{ __html: msg.details }} />
          <div className='app-message-when'>{msg.when}</div>
        </div>
      ))
    if (!messageDivs.length) {
      messageDivs = <EmptyPaneContents>No Message to Display</EmptyPaneContents>
    }
    /* eslint-enable */
    return (
      <div className="pane-content">
        {messageDivs}
      </div>
    )
  }
}

export function mapStateToProps(state) {
  const appMessages = state.appMessages.slice()
  appMessages.reverse()
  appMessages.sort((a, b) => {
    if (Date.parse(a.when) > Date.parse(b.when)) return -1
    return 1
  })
  return {
    appMessages,
  }
}

export default connect(mapStateToProps)(AppInfoPaneUnconnected)
