import React from 'react'
import { shallow } from 'enzyme'
import Resizable from 're-resizable'
import { PaneContainerUnconnected } from '../pane-container'
import tasks from '../../../actions/eval-frame-tasks'

describe('PaneContainer', () => {
  let mountedVariable
  let props
  const paneContainer = () => {
    if (!mountedVariable) {
      mountedVariable = shallow(<PaneContainerUnconnected {...props} />)
    }
    return mountedVariable
  }

  beforeEach(() => {
    props = {
      sidePaneMode: 'DECLARED_VARIABLES',
      title: 'Declared Variables',
      paneHeight: 300,
      openOnMode: 'DECLARED_VARIABLES', // this shoudl be open now.
      viewMode: 'editor',
      task: tasks.toggleDeclaredVariablesPane,
    }
    mountedVariable = undefined
  })

  it('should contain one Resizable', () => {
    expect(paneContainer().find(Resizable)).toHaveLength(1)
  })

  it('should have the Resizable size.height > 0 when openOnMode === sidePaneMode', () => {
    expect(paneContainer().find(Resizable).props().size.height).toBeGreaterThan(0)
  })

  it('should be collapsed when openOnMode !== sidePaneMode', () => {
    props.openOnMode = 'HISTORY'
    expect(paneContainer().find(Resizable).props().size.height).toBe(0)
  })

  it('should contain one div of class view-pane', () => {
    expect(paneContainer().find('div.view-pane')).toHaveLength(1)
  })
})
