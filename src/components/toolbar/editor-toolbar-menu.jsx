import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import MenuIcon from 'material-ui/svg-icons/navigation/menu'
import { grey50 } from 'material-ui/styles/colors'
import IconButton from 'material-ui/IconButton'

import IconMenu from './icon-menu'
import NotebookMenuItem from './notebook-menu-item'
import NotebookMenuSubsection from './notebook-menu-subsection'
import NotebookMenuDivider from './notebook-menu-divider'

import tasks from '../../task-definitions'
import cellMenuSubsection from './cell-menu-subsection'


export class EditorToolbarMenuUnconnected extends React.Component {
  static propTypes = {
    viewMode: PropTypes.string,
  }
  render() {
    return (
      <div className="notebook-menu" style={{ display: this.props.viewMode === 'editor' ? 'block' : 'none' }}>
        <IconMenu
          icon={<IconButton><MenuIcon color={grey50} /></IconButton>}
        >
          <NotebookMenuItem task={tasks.createNewNotebook} />
          <NotebookMenuItem task={tasks.exportNotebook} />

          <NotebookMenuSubsection title="saved notebooks">
            <NotebookMenuItem />
          </NotebookMenuSubsection>
          <NotebookMenuSubsection title="Cell ...">
            {cellMenuSubsection}
          </NotebookMenuSubsection>
          <NotebookMenuDivider />
          <NotebookMenuSubsection title="View ...">
            <NotebookMenuItem task={tasks.toggleHistoryPane} />
            <NotebookMenuItem task={tasks.toggleDeclaredVariablesPane} />
          </NotebookMenuSubsection>
          <NotebookMenuDivider />
          <NotebookMenuItem task={tasks.fileAnIssue} />
        </IconMenu>
      </div>
    )
  }
}

export function mapStateToProps(state) {
  return { viewMode: state.mode }
}

export default connect(mapStateToProps)(EditorToolbarMenuUnconnected)
