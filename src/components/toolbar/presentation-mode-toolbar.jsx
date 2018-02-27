import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import ViewModeToggleButton from './view-mode-toggle-button'

export class PresentationModeToolbarUnconnected extends React.Component {
  static propTypes = {
    viewMode: PropTypes.string,
  }

  render() {
    return (
      <div className="presentation-menu" style={{ display: (this.props.viewMode === 'presentation' ? 'block' : 'none') }} >
        <div className="presentation-header">
          <div className="view-mode-toggle-from-presentation">
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
              <ViewModeToggleButton textColor="black" />
            </MuiThemeProvider>
          </div>
        </div>
      </div>

    )
  }
}

export function mapStateToProps(state) {
  return {
    viewMode: state.mode,
  }
}

export default connect(mapStateToProps)(PresentationModeToolbarUnconnected)
