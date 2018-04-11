import React from 'react'
import { connect } from 'react-redux'
import NotebookMenuItem from '../menu/notebook-menu-item'
import NotebookMenuDivider from '../menu/notebook-menu-divider'

import { getCellById } from '../../tools/notebook-utils'
import tasks from '../../actions/task-definitions'

export class CellMenuUnconnected extends React.Component {
  render() {
    const toggleRunAllTask = (
      this.props.includeInRunAll ?
        tasks.skipCellInRunAll :
        tasks.includeCellInRunAll
    )
    return (
      <div className="cell-menu-items-container">
        <NotebookMenuItem
          key={tasks.changeToJavascriptCell.title}
          task={tasks.changeToJavascriptCell}
          disabled={this.props.menuLabel === 'js'}
        />
        <NotebookMenuItem
          key={tasks.changeToMarkdownCell.title}
          task={tasks.changeToMarkdownCell}
          disabled={this.props.menuLabel === 'md'}
        />
        <NotebookMenuItem
          key={tasks.changeToCSSCell.title}
          task={tasks.changeToCSSCell}
          disabled={this.props.menuLabel === 'css'}
        />
        <NotebookMenuItem
          key={tasks.changeToExternalResourceCell.title}
          task={tasks.changeToExternalResourceCell}
          disabled={this.props.menuLabel === 'resource'}
        />
        <NotebookMenuItem
          key={tasks.changeToRawCell.title}
          task={tasks.changeToRawCell}
          disabled={this.props.menuLabel === 'raw'}
        />
        <NotebookMenuItem
          key={tasks.changeToPluginCell.title}
          task={tasks.changeToPluginCell}
          disabled={this.props.menuLabel === 'plugin'}
        />

        <NotebookMenuDivider />
        <NotebookMenuItem
          key={toggleRunAllTask.title}
          task={toggleRunAllTask}
        />
      </div>
    )
  }
}


function mapStateToProps(state, ownProps) {
  const { cellId } = ownProps
  const { includeInRunAll } = getCellById(state.cells, cellId)
  return { includeInRunAll }
}

export default connect(mapStateToProps)(CellMenuUnconnected)
