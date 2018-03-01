import React from 'react'

import IconButton from 'material-ui/IconButton'
import Menu from 'material-ui/Menu'
import MenuIcon from 'material-ui-icons/Menu'

import tasks from '../../task-definitions'
import NotebookMenuItem from './notebook-menu-item'
import NotebookMenuDivider from './notebook-menu-divider'

import CellMenuSubsection from './cell-menu-subsection'
import SavedNotebooksAndExamplesSubsection from './saved-notebooks-and-examples-subsection'
import ViewModeToggleSubsection from './view-mode-toggle-subsection'

export default class EditorToolbarMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorElement: null,
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  handleClick(event) {
    this.setState({ anchorElement: event.currentTarget })
  }

  handleClose() {
    this.setState({ anchorElement: null })
  }

  render() {
    const { anchorElement } = this.state
    return (
      <IconButton
        aria-label="more"
        aria-owns={anchorElement ? 'main-menu' : null}
        aria-haspopup="true"
        onClick={this.handleClick}
        style={{ color: 'white' }}
      >
        <MenuIcon />
        <Menu
          id="main-menu"
          anchorEl={this.state.anchorElement}
          open={Boolean(anchorElement)}
          onClose={this.handleClose}
          anchorReference="anchorPosition"
          anchorPosition={{ top: 62, left: 30 }}
        >
          <NotebookMenuItem task={tasks.createNewNotebook} />
          <NotebookMenuItem task={tasks.saveNotebook} />
          <NotebookMenuItem task={tasks.exportNotebook} />

          <SavedNotebooksAndExamplesSubsection />

          <CellMenuSubsection />

          <NotebookMenuDivider />

          <ViewModeToggleSubsection />

          <NotebookMenuDivider />

          <NotebookMenuItem task={tasks.fileAnIssue} />
        </Menu>
      </IconButton>

    )
  }
}

// function createMenuItem(task) {
//   return (<MenuItem
//     key={task.title}
//     style={{ fontSize: '13px' }}
//     primaryText={task.menuTitle}
//     secondaryText={task.displayKeybinding}
//     onClick={task.callback}
//   />)
// }

// class AnotherItem extends MenuItem {
//   constructor(props) {
//     const newProps = Object.assign(props,  {
//       key: props.task.title,
//       style: { fontSize: '13px' },
//       primaryText: props.task.menuTitle,
//       secondaryText: props.task.menuTitle
//     })
//     super(newProps)
//   }

//   render() { return { super.render() } }
// }


// export default class EditorToolbarMenu extends React.Component {
//   render() {
//     return (
//       <IconMenu
//         iconButtonElement={<IconButton><MenuIcon color={grey50} /></IconButton>}
//         anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
//         targetOrigin={{ horizontal: 'left', vertical: 'top' }}
//         desktop
//         className="menu-button"
//       >
//         {createMenuItem(tasks.toggleHistoryPane)}
//         <MenuItem
//           primaryText="test ..."
//           rightIcon={<ArrowDropRight />}
//           menuItems={[createMenuItem(tasks.saveNotebook)]}
//         />
//       </IconMenu>

//     )
//   }
// }

// export default class EditorToolbarMenu extends React.Component {
//   render() {
//     return (
//       <IconMenu
//         iconButtonElement={<IconButton><MenuIcon color={grey50} /></IconButton>}
//         anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
//         targetOrigin={{ horizontal: 'left', vertical: 'top' }}
//         desktop
//         className="menu-button"
//       >
//         <AnotherItem task={tasks.toggleHistoryPane} />
//         <MenuItem
//           primaryText="test ..."
//           rightIcon={<ArrowDropRight />}
//           menuItems={[createMenuItem(tasks.saveNotebook)]}
//         />
//       </IconMenu>

//     )
//   }
// }
