import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'


export class ViewModeStylesHandlerUnconnected extends React.Component {
  static propTypes = {
    viewModeStyleSheet: PropTypes.string,
  }

  render() {
    return (
      <React.Fragment>
        {this.props.viewModeStyleSheet}
      </React.Fragment>
    )
  }
}


function mapStateToProps(state) {
  let viewModeStyleSheet
  if (state.viewMode === 'EXPLORE_VIEW') {
    viewModeStyleSheet = `
html, body {
  overflow-y: hidden;
  height: 100vh;
}

div#eval-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

div#cells {
  width: 100%;
  overflow-y: auto;
  padding-top: 20px;
  padding-left: 25px;
  padding-right: 25px;
}
`
  } else if (state.viewMode === 'REPORT_VIEW') {
    viewModeStyleSheet = `
html, body {
  overflow-y: auto;
  /* height: 100vh; don't set height*/
}

div#eval-container {
  /* no additional styles */
}

div#cells {
  padding-left: 25px;
  padding-right: 25px;
}

div.eval-frame-panes-container {
  display: none;
}

/* cell styles */

div.cell-container {
  outline: none;
  padding: 0px;
  margin: 0px;
}

div.collapse-button {
  display: none;
  height: 0px
}

div.cell-row.HIDDEN {
  display: none;
}

div.cell-menu-container {
  display: none;
  height: 0px;
  width: 0px !important;
}

div.not-evaluated { display: none; }
`
  }

  return {
    viewModeStyleSheet,
  }
}

export default connect(mapStateToProps)(ViewModeStylesHandlerUnconnected)
