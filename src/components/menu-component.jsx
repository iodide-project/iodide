import React from 'react'

import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import { grey50 } from 'material-ui/styles/colors'
import MenuIcon from 'material-ui/svg-icons/navigation/menu'
import Subheader from 'material-ui/Subheader'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right'
import { ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar'
import AddButton from 'material-ui/svg-icons/content/add'
import UpArrow from 'material-ui/svg-icons/navigation/arrow-upward'
import DownArrow from 'material-ui/svg-icons/navigation/arrow-downward'
import PlayButton from 'material-ui/svg-icons/av/play-arrow'
import FastForward from 'material-ui/svg-icons/av/fast-forward'

import { menuItems } from '../menu-content'


function transformToMaterialUIComponent(item, parentComponent, childrenClass = false) {
  if (Object.prototype.hasOwnProperty.call(item, 'itemType')) {
    if (item.itemType === 'Divider') {
      return <Divider />
    }
    if (item.itemType === 'Subheader') {
      return <Subheader> {item.name} </Subheader>
    }
  } else {
    const out = {}
    out.primaryText = item.primaryText
    out.secondaryText = item.secondaryText || ' '
    if (Object.prototype.hasOwnProperty.call(item, 'menuItems')) {
      if (typeof item.menuItems === 'function') {
        out.menuItems = item.menuItems(parentComponent)
      } else {
        out.menuItems = item.menuItems
      }
      out.menuItems = out.menuItems.map(subitem =>
        transformToMaterialUIComponent(subitem, parentComponent, item.childrenClass))
    }
    if (Object.prototype.hasOwnProperty.call(item, 'menuItems')) {
      out.rightIcon = <ArrowDropRight />
    }
    out.className = item.className || ''
    if (childrenClass) {
      out.className += ` ${childrenClass}`
    }
    out.style = { fontSize: '13px', width: '300px !important' }
    if (Object.prototype.hasOwnProperty.call(item, 'callback')) {
      out.onClick = item.callback.bind(parentComponent)
    }
    return <MenuItem {...out} />
  }

  throw Error('Could not transform to component')
}

function menuComponents(items, parentComponent) {
  const out = {}
  Object.keys(items).forEach((k) => {
    out[k] = transformToMaterialUIComponent(items[k], parentComponent)
  })
  return out
}


class MainMenu extends React.Component {
  constructor(props) {
    super(props)
    this.insertCell = this.insertCell.bind(this)
    this.cellUp = this.cellUp.bind(this)
    this.cellDown = this.cellDown.bind(this)
    this.runCell = this.runCell.bind(this)
    this.deleteNotebook = this.deleteNotebook.bind(this)
    this.runAllCells = this.runAllCells.bind(this)
  }

  deleteNotebook(notebook) {
    this.props.actions.deleteNotebook(notebook)
  }

  runAllCells() {
    this.props.actions.runAllCells()
    if (this.props.pageMode !== 'command') this.props.actions.changeMode('command')
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
    const mc = menuComponents(menuItems, this)

    return (
      <ToolbarGroup firstChild={this.props.firstChild}>
        <IconMenu
          style={{ fontSize: '12px' }}
          iconButtonElement={<IconButton><MenuIcon color={grey50} /></IconButton>}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          menuStyle={{ width: '400px !important' }}
          listStyle={{ width: '350px !important' }}
          desktop
          className="menu-button"
        >

          {mc.newNotebook}
          {mc.saveNotebook}
          {mc.deleteNotebook}
          {mc.importNotebookFromJSON}
          {mc.exportNotebookAsJSON}

          {mc.savedNotebooks}
          <Divider />
          {mc.cell}
          <Divider />
          {mc.view}
          <Divider />
          {mc.fileAnIssue}
        </IconMenu>

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
