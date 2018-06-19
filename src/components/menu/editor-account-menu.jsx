import React from 'react'

import NotebookIconMenu from './icon-menu'
import tasks from '../../actions/task-definitions'
import NotebookMenuItem from './notebook-menu-item'

export default class EditorAccountMenu extends React.Component {
  render() {
    return (
      <NotebookIconMenu
        anchorClass="view-controls"
        position={{ vertical: 'bottom', horizontal: 220 }}
        icon={<img src={this.props.avatar} alt="" className="user-avatar" />}
      >
        <NotebookMenuItem task={tasks.logoutGithub} />
        <NotebookMenuItem task={tasks.logoutGithub} />
        <NotebookMenuItem task={tasks.logoutGithub} />
        <NotebookMenuItem task={tasks.logoutGithub} />
        <NotebookMenuItem task={tasks.logoutGithub} />
      </NotebookIconMenu>
    )
  }
}
