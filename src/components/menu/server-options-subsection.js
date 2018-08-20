import React from 'react'
import { connect } from 'react-redux'

import NotebookMenuItem from './notebook-menu-item'
import NotebookMenuSubsection from './notebook-menu-subsection'

import tasks from '../../actions/task-definitions'

class ServerOptionsSubsection extends React.Component {
  render() {
    return (
      <NotebookMenuSubsection title="server options ... " {...this.props} >
        <NotebookMenuItem task={tasks.saveNotebookToServer} />
        <NotebookMenuItem task={tasks.forkNotebook} />
        <NotebookMenuItem task={tasks.exportGist} />
      </NotebookMenuSubsection>
    )
  }
}

function mapStateToProps(state) {
  return {
    notebookId: state.notebookId,
  }
}

export default connect(mapStateToProps)(ServerOptionsSubsection)
