import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import DeleteButton from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import MiniToolbar from '../../../components/controls/mini-toolbar'

import * as actions from '../../actions/actions'

export class ConsoleToolbarUnconnected extends React.Component {
  static propTypes = {
    actions: PropTypes.shape({
      clearHistory: PropTypes.func.isRequired,
    }).isRequired,
  }

  render() {
    return (
      <MiniToolbar>
        <Tooltip
          classes={{ tooltip: 'iodide-tooltip' }}
          title="Clear console"
          placement="bottom-start"
        >
          <IconButton
            size="small"
            classes={{ root: 'mini-toolbar-button' }}
            className="menu-button"
            onClick={this.props.actions.clearHistory}
          >
            <DeleteButton fontSize="small" />
          </IconButton>
        </Tooltip>
      </MiniToolbar>
    )
  }
}

export function mapStateToProps() {
  return { }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

const ConsoleToolbar = connect(mapStateToProps, mapDispatchToProps)(ConsoleToolbarUnconnected)
export default ConsoleToolbar
