import React from 'react'
import { shallow } from 'enzyme'

import KeyboardShortcutList from '../keyboard-shortcut-list'
import UserTask from '../../../actions/user-task'


describe('HelpModalUnconnected React component', () => {
  let props
  let componentForTestCase

  const getTestComponent = () => {
    if (!componentForTestCase) {
      componentForTestCase = shallow(<KeyboardShortcutList {...props} />)
    }
    return componentForTestCase
  }

  beforeEach(() => {
    // postMessageToEditorMock = jest.fn()
    props = {
      helpModalOpen: true,
      tasks: {
        a: new UserTask({
          title: 'task a',
          displayKeybinding: 'a',
          commandModeOnlyKey: true,
          callback: () => jest.fn(),
        }),
        b: new UserTask({
          title: 'task b',
          displayKeybinding: 'b',
          commandModeOnlyKey: true,
          callback: () => jest.fn(),
        }),
        c: new UserTask({
          title: 'task c',
          displayKeybinding: 'c',
          callback: () => jest.fn(),
        }),
        d: new UserTask({
          title: 'task d',
          displayKeybinding: 'd',
          commandModeOnlyKey: false,
          callback: () => jest.fn(),
        }),
        e: new UserTask({
          title: 'task e',
          displayKeybinding: 'e',
          commandModeOnlyKey: false,
          callback: () => jest.fn(),
        }),
      },
    }
    componentForTestCase = undefined
  })

  it('has the right number of global shortcuts', () => {
    expect(getTestComponent().find('.keyboard-shortcuts-global').children().length)
      .toEqual(3)
  })

  it('has the right number of command mode shortcuts', () => {
    expect(getTestComponent().find('.keyboard-shortcuts-command-mode').children().length)
      .toEqual(2)
  })
})
