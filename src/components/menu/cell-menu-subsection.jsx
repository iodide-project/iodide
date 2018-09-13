import React from 'react'
import NotebookMenuItem from './notebook-menu-item'
import NotebookMenuDivider from './notebook-menu-divider'
import NotebookMenuHeader from './notebook-menu-header'
import NotebookMenuSubsection from './notebook-menu-subsection'

import tasks from '../../actions/task-definitions'

export default class CellMenuSubsection extends React.Component {
  render() {
    return (
      <NotebookMenuSubsection className="medium-menu" title="cell ..." {...this.props} >
        <NotebookMenuItem key={tasks.moveCellUp.title} task={tasks.moveCellUp} />
        <NotebookMenuItem key={tasks.moveCellDown.title} task={tasks.moveCellDown} />
        <NotebookMenuItem key={tasks.addCellBelow.title} task={tasks.addCellBelow} />
        <NotebookMenuItem key={tasks.addCellAbove.title} task={tasks.addCellAbove} />
        <NotebookMenuItem key={tasks.deleteCell.title} task={tasks.deleteCell} />
        <NotebookMenuItem key={tasks.copyCell.title} task={tasks.copyCell} />
        <NotebookMenuItem key={tasks.cutCell.title} task={tasks.cutCell} />
        <NotebookMenuItem key={tasks.pasteCell.title} task={tasks.pasteCell} />
        <NotebookMenuDivider />
        <NotebookMenuHeader title="change cell to ..." />
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
      </NotebookMenuSubsection>)
  }
}
