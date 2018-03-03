import React from 'react'
import { shallow } from 'enzyme'

import MenuItem from 'material-ui/Menu/MenuItem'
import { ListItemText } from 'material-ui/List'

import NotebookMenuItem from '../../src/components/toolbar/notebook-menu-item'
import UserTask from '../../src/user-task'

describe('NotebookMenuItem children', () => {
  let props
  let mountedComp
  const nbMenuItem = () => {
    if (!mountedComp) {
      mountedComp = shallow(<NotebookMenuItem {...props} />)
    }
    return mountedComp
  }

  beforeEach(() => {
    props = {
      task: new UserTask({ title: 'ok', callback: () => {}, displayKeybinding: 'a' }),
    }
    mountedComp = undefined
  })

  it('renders one MenuItem', () => {
    expect(NotebookMenuItem.muiName).toBe('MenuItem')
    expect(nbMenuItem().find(MenuItem).length).toBe(1)
    expect(nbMenuItem().find(ListItemText).length).toBe(2)
    expect(nbMenuItem().find(ListItemText).first().props().primary).toBe(props.task.title)
  })

  it('renders one MenuItem with keybinding', () => {
    expect(nbMenuItem().find(ListItemText).last()
      .props().primary).toBe(props.task.displayKeybinding)
  })
  it('renders one MenuItem with secondaryText', () => {
    const nb = shallow(<NotebookMenuItem task={new UserTask({ title: 'ok', callback: () => {}, secondaryText: 'neat' })} />)
    expect(nb.find(ListItemText).last()
      .props().primary).toBe('neat')
  })
})
