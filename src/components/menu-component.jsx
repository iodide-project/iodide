import React from 'react'

import IconButton from 'material-ui/IconButton'
import { ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar'
import AddButton from 'material-ui/svg-icons/content/add'
import UpArrow from 'material-ui/svg-icons/navigation/arrow-upward'
import DownArrow from 'material-ui/svg-icons/navigation/arrow-downward'
import PlayButton from 'material-ui/svg-icons/av/play-arrow'
import FastForward from 'material-ui/svg-icons/av/fast-forward'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types';

import EditorToolbarMenu from './toolbar/editor-toolbar-menu'


// function transformToMaterialUIComponent(item, parentComponent, childrenClass = false) {
//   if (Object.prototype.hasOwnProperty.call(item, 'itemType')) {
//     if (item.itemType === 'Divider') {
//       return <Divider />
//     }
//     if (item.itemType === 'Subheader') {
//       return <Subheader> {item.name} </Subheader>
//     }
//   } else {
//     const out = {}
//     out.primaryText = item.primaryText
//     out.secondaryText = item.secondaryText || ' '
//     if (Object.prototype.hasOwnProperty.call(item, 'menuItems')) {
//       if (typeof item.menuItems === 'function') {
//         out.menuItems = item.menuItems(parentComponent)
//       } else {
//         out.menuItems = item.menuItems
//       }
//       out.menuItems = out.menuItems.map(subitem =>
//         transformToMaterialUIComponent(subitem, parentComponent, item.childrenClass))
//     }
//     if (Object.prototype.hasOwnProperty.call(item, 'menuItems')) {
//       out.rightIcon = <ArrowDropRight />
//     }
//     out.className = item.className || ''
//     if (childrenClass) {
//       out.className += ` ${childrenClass}`
//     }
//     out.style = { fontSize: '13px', width: '300px !important' }
//     if (Object.prototype.hasOwnProperty.call(item, 'callback')) {
//       out.onClick = item.callback.bind(parentComponent)
//     }
//     return <MenuItem {...out} />
//   }

//   throw Error('Could not transform to component')
// }

// function menuComponents(items, parentComponent) {
//   const out = {}
//   Object.keys(items).forEach((k) => {
//     out[k] = transformToMaterialUIComponent(items[k], parentComponent)
//   })
//   return out
// }


class MainMenu extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    pageMode: PropTypes.oneOf(['command', 'edit']),
    viewMode: PropTypes.oneOf(['editor', 'presentation']),
    actions: PropTypes.shape({
      changeMode: PropTypes.func.isRequired,
      runAllCells: PropTypes.func.isRequired,
      evaluateCell: PropTypes.func.isRequired,
      insertCell: PropTypes.func.isRequired,
      cellUp: PropTypes.func.isRequired,
      cellDown: PropTypes.func.isRequired,
    }).isRequired,
    firstChild: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      isDeleteNotebookDialogOpen: false,
    }
    this.insertCell = this.insertCell.bind(this)
    this.cellUp = this.cellUp.bind(this)
    this.cellDown = this.cellDown.bind(this)
    this.runCell = this.runCell.bind(this)
    this.deleteNotebook = this.deleteNotebook.bind(this)
    this.runAllCells = this.runAllCells.bind(this)
    this.switchDeleteNotebookDialog = this.switchDeleteNotebookDialog.bind(this)
    this.closeDialogAndDeleteNotebook = this.closeDialogAndDeleteNotebook.bind(this)
  }

  switchDeleteNotebookDialog() {
    this.setState({
      isDeleteNotebookDialogOpen: !this.state.isDeleteNotebookDialogOpen,
    })
  }

  closeDialogAndDeleteNotebook() {
    this.setState({
      isDeleteNotebookDialogOpen: !this.state.isDeleteNotebookDialogOpen,
    })
    this.props.actions.deleteNotebook(this.props.title)
  }

  deleteNotebook() {
    this.switchDeleteNotebookDialog()
  }

  runAllCells() {
    // first evaluate all MD and dom cells, b/c they might include dom elts targeted by other cells
    this.props.cellIdList.forEach((cellId, i) => {
      if (this.props.cellTypeList[i] === 'markdown' ||
          this.props.cellTypeList[i] === 'dom') {
        this.props.actions.evaluateCell(cellId)
      }
    })
    window.setTimeout(
      () => {
        this.props.cellIdList.forEach((cellId, i) => {
          if (this.props.cellTypeList[i] !== 'markdown' &&
              this.props.cellTypeList[i] !== 'dom') {
            this.props.actions.evaluateCell(cellId)
          }
        })
      },
      42, // wait a few milliseconds to let React DOM updates flush
    )
  }

  runCell() {
    this.props.actions.evaluateCell()
    if (this.props.pageMode !== 'command') this.props.actions.changeMode('command')
  }

  insertCell() {
    this.props.actions.insertCell('javascript', 'below')
  }

  cellUp() {
    this.props.actions.cellUp()
  }

  cellDown() {
    this.props.actions.cellDown()
  }


  render() {
    const deleteNotebookDialogOptions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.switchDeleteNotebookDialog}
      />,
      <FlatButton
        label="Delete"
        primary
        onClick={this.closeDialogAndDeleteNotebook}
      />,
    ];
    // const mc = menuComponents(menuItems, this)

    return (
      <ToolbarGroup firstChild={this.props.firstChild}>
        <Dialog
          open={this.state.isDeleteNotebookDialogOpen}
          actions={deleteNotebookDialogOptions}
        >
          Delete Notebook?
        </Dialog>

        <EditorToolbarMenu />

        <IconButton
          tooltip="insert cell"
          style={{ color: '#fafafa' }}
          onClick={this.insertCell}
        >
          <AddButton />
        </IconButton>
        <IconButton
          tooltip="cell up"
          style={{ color: '#fafafa' }}
          onClick={this.cellUp}
        >
          <UpArrow />
        </IconButton>
        <IconButton
          tooltip="cell down"
          style={{ color: '#fafafa' }}
          onClick={this.cellDown}
        >
          <DownArrow />
        </IconButton>
        <ToolbarSeparator />

        <IconButton
          tooltip="run cell"
          style={{ color: '#fafafa' }}
          onClick={this.runCell}
        >
          <PlayButton />
        </IconButton>


        <IconButton
          tooltip="run all cells"
          style={{ color: '#fafafa' }}
          onClick={this.runAllCells}
        >
          <FastForward />
        </IconButton>
      </ToolbarGroup>
    )
  }
}

export default MainMenu
