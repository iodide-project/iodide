import React from 'react'
// import Paper from 'material-ui/Paper'
import NotebookMenuItem from '../menu/notebook-menu-item'
// import NotebookMenuDivider from '../menu/notebook-menu-divider'

import tasks from '../../actions/task-definitions'

export default class CellMenu extends React.Component {
  render() {
    return (
      <div className="cell-menu-items-container">
        <NotebookMenuItem
          key={tasks.changeToJavascriptCell.title}
          task={tasks.changeToJavascriptCell}
        />
        <NotebookMenuItem
          key={tasks.changeToMarkdownCell.title}
          task={tasks.changeToMarkdownCell}
        />
        <NotebookMenuItem
          key={tasks.changeToCSSCell.title}
          task={tasks.changeToCSSCell}
        />
        <NotebookMenuItem
          key={tasks.changeToExternalResourceCell.title}
          task={tasks.changeToExternalResourceCell}
        />
        <NotebookMenuItem
          key={tasks.changeToRawCell.title}
          task={tasks.changeToRawCell}
        />
        <NotebookMenuItem
          key={tasks.changeToPluginCell.title}
          task={tasks.changeToPluginCell}
        />
      </div>
    )
  }
}
