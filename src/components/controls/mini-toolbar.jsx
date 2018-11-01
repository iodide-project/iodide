import React from 'react'
import { connect } from 'react-redux'

import Toolbar from '@material-ui/core/Toolbar'

export class MiniToolbarUnconnected extends React.Component {
  render() {
    return (
      <Toolbar
        style={{ minHeight: '0' }}
        variant="dense"
        disableGutters
        classes={{ root: 'mini-toolbar' }}
      >
        {this.props.children}
      </Toolbar>
    )
  }
}

export function mapStateToProps() {
  return { }
}

const MiniToolbar = connect(mapStateToProps)(MiniToolbarUnconnected)
export default MiniToolbar
