import React from 'react'
// import Paper from 'material-ui/Paper'
import NotebookMenuItem from './notebook-menu-item'
import NotebookMenuDivider from './notebook-menu-divider'
import NotebookMenuHeader from './notebook-menu-header'
import NotebookMenuSubsection from './notebook-menu-subsection'

import tasks from '../../task-definitions'
import { getLanguages } from '../../language'

export default class CellMenuSubsection extends React.Component {
  render() {
    const languages = getLanguages().map(language =>
      <NotebookMenuItem key={language.name} task={language.task} />)

    return (
      <NotebookMenuSubsection className="medium-menu" title="cell ..." {...this.props} >
        <NotebookMenuItem key={tasks.moveCellUp.title} task={tasks.moveCellUp} />
        <NotebookMenuItem key={tasks.moveCellDown.title} task={tasks.moveCellDown} />
        <NotebookMenuItem key={tasks.addCellBelow.title} task={tasks.addCellBelow} />
        <NotebookMenuItem key={tasks.deleteCell.title} task={tasks.deleteCell} />
        <NotebookMenuDivider />
        <NotebookMenuHeader title="change cell to ..." />
        {languages}
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
        <NotebookMenuItem key={tasks.changeToRawCell.title} task={tasks.changeToRawCell} />
      </NotebookMenuSubsection>)
  }
}
