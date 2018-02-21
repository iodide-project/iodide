import React from 'react'
import PropTypes from 'prop-types'

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import ViewModeToggleButton from './view-mode-toggle-button'

class PresentationMenu extends React.Component {
  static propTypes = {
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    title: PropTypes.string,
  }
  render() {
    return (
      <div className="presentation-header">
        <div className="view-mode-toggle-from-presentation">
          <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
            <ViewModeToggleButton textColor="black" actions={this.props.actions} viewMode={this.props.viewMode} />
          </MuiThemeProvider>
        </div>
        <h1 className="presentation-title" style={{ color: this.props.title === undefined ? 'gray' : 'black' }}>{this.props.title || 'new notebook'}</h1>
      </div>
    )
  }
}

export default PresentationMenu
