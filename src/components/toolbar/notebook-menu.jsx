import React from 'react'
import Menu from 'material-ui/Menu'

export default class NotebookMenu extends React.Component {
  render() {
    return <Menu> {this.props.children} </Menu>
  }
}

/*

export default class NotebookMenuItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (<MenuItemzz`    `
      primaryText={this.props.task.menuTitle}
      secondaryText={this.props.task.displayKeybinding}
      onClick={this.props.task.callback}
    />)
  }
}

const NBMainMenu = (
  <NotebookMenu>
    <NotebookMenuItem task={tasks.createNewNotebook} />
    <NotebookMenuItem task={tasks.saveNotebook} />
    <NotebookMenuItem task={tasks.deleteNotebook} />
    <NotebookMenuItem task={tasks.importNotebookFromJSMD} />
    <NotebookMenuItem task={tasks.exportNotebook} />
    <NotebookMenuDivider />
    <NotebookMenuSubsection title='Cell'>
        <NotebookMenuItem task={tasks.evaluateCell} />
        <NotebookMenuItem task={tasks.moveCellUp} />
        <NotebookMenuItem task={tasks.moveCellDown} />
        <NotebookMenuItem task={tasks.addCellAbove} />
        <NotebookMenuItem task={tasks.addCellBelow} />
        <NotebookMenuItem task={tasks.deleteCell} />
        <NotebookMenuDivider />
        <NotebookSubheader title="Change To ..." />
        <NotebookMenuItem task={tasks.changeCellToJavascript} />
        <NotebookMenuItem task={tasks.changeCellToMarkdown} />
        <NotebookMenuItem task={tasks.changeCellToCSS} />
        <NotebookMenuItem task={tasks.changeCellToExternalDependency} />
        <NotebookMenuItem task={tasks.changeCellToRaw} />
        <NotebookMenuDivider />
        <NotebookMenuItem task={tasks.makeInputVisibleInPresentation} />
        <NotebookMenuItem task={tasks.makeOutputVisibleInPresentation} />
    </NotebookMenuSubsection>
    <NotebookMenuDivider />
    <NotebookMenuSubsection title='View'>
        <NotebookMenuItem task={tasks.showDeclaredVariablesPane} />
        <NotebookMenuItem task={tasks.showHistoryPane} />
    </NotebookMenuSubsection>
    <NotebookMenuItem task={tasks.fileAnIssue} />
  </NotebookMenu>
)


const CellMenu = (
    <NotebookMenuItem task={tasks.evaluateCell} />
        <NotebookMenuItem task={tasks.moveCellUp} />
        <NotebookMenuItem task={tasks.moveCellDown} />
        <NotebookMenuItem task={tasks.addCellAbove} />
        <NotebookMenuItem task={tasks.addCellBelow} />
        <NotebookMenuItem task={tasks.deleteCell} />
        <NotebookMenuDivider />
        <NotebookSubheader title="Change To ..." />
        <NotebookMenuItem task={tasks.changeCellToJavascript} />
        <NotebookMenuItem task={tasks.changeCellToMarkdown} />
        <NotebookMenuItem task={tasks.changeCellToCSS} />
        <NotebookMenuItem task={tasks.changeCellToExternalDependency} />
        <NotebookMenuItem task={tasks.changeCellToRaw} />
        <NotebookMenuDivider />
        <NotebookMenuItem task={tasks.makeInputVisibleInPresentation} />
        <NotebookMenuItem task={tasks.makeOutputVisibleInPresentation} />
    </NotebookMenu>
)


*/
