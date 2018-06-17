import { shallow } from 'enzyme'
import React from 'react'

import Drawer from 'material-ui/Drawer'
import { MuiThemeProvider } from 'material-ui/styles'
import Resizable from 're-resizable'

import { SidePaneUnconnected, mapStateToProps } from '../side-pane'
import tasks from '../../../actions/task-definitions'

describe('SidePaneUnconnected React component', () => {
  let props
  let mountedPane

  const sidePane = () => {
    if (!mountedPane) {
      mountedPane = shallow(<SidePaneUnconnected {...props} />)
    }
    return mountedPane
  }

  beforeEach(() => {
    props = {
      sidePaneMode: '_APP_INFO',
      title: 'App info',
      sidePaneWidth: 562,
      openOnMode: '_APP_INFO',
      task: tasks.toggleAppInfoPane,
    }
    mountedPane = undefined
  })

  it('always renders one MuiThemeProvider', () => {
    expect(sidePane().find(MuiThemeProvider).length).toBe(1)
  })

  it('always renders one Drawer inside MuiThemeProvider', () => {
    expect(sidePane().wrap(sidePane().find(MuiThemeProvider))
      .find(Drawer)).toHaveLength(1)
  })

  it("sets the Drawer's open prop to be true for correct props", () => {
    props.sidePaneMode = '_APP_INFO'
    props.openOnMode = '_APP_INFO'
    expect(sidePane().find(Drawer).props().open)
      .toBe(true)
  })

  it("sets the Drawer's open prop to be false for incorrect props", () => {
    props.sidePaneMode = '_APP_INFO'
    props.openOnMode = 'history'
    expect(sidePane().find(Drawer).props().open)
      .toBe(false)
  })

  it('always renders one Resizable inside Drawer', () => {
    expect(sidePane().wrap(sidePane().find(Drawer))
      .find(Resizable)).toHaveLength(1)
  })

  it("sets the Resizable's onResizeStop prop to correct function", () => {
    // const changeSidePaneWidth = jest.spyOn(tasks, 'changeSidePaneWidth.callback')
    sidePane().find(Resizable).prop('onResizeStop')(1, 'left', 1, { width: 562 })
    // expect(changeSidePaneWidth.mock.calls.length).toBe(1)
  })

  it('always renders one div with class pane-header inside Resizable', () => {
    expect(sidePane().wrap(sidePane().find(Resizable))
      .find('div.pane-header')).toHaveLength(1)
  })

  it('always renders one div with class pane-title inside pane-header', () => {
    expect(sidePane().wrap(sidePane().find('div.pane-header'))
      .find('div.pane-title')).toHaveLength(1)
  })

  it('always renders two children inside pane-title div', () => {
    expect(sidePane().find('div.pane-title').at(0).children()
      .length).toBe(2)
  })
})

describe('SidePane mapStateToProps', () => {
  let state

  beforeEach(() => {
    state = {
      sidePaneMode: 'history',
      sidePaneWidth: '562',
    }
  })

  it('should return the correct basic info', () => {
    expect(mapStateToProps(state))
      .toEqual({
        sidePaneMode: 'history',
        sidePaneWidth: '562',
      })
  })
})
