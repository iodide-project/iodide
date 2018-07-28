import React from 'react'
import { shallow } from 'enzyme'
import Resizable from 're-resizable'
import { PaneContainerUnconnected, mapStateToProps } from '../pane-container'

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
      viewPaneDisplayStyle: 'block',
      paneHeight: 300,
      changePaneHeight: jest.fn(),
      paneTitle: 'a pane title',
    }
    mountedVariable = undefined
  })

  it('should contain one Resizable', () => {
    expect(paneContainer().find(Resizable)).toHaveLength(1)
  })

  it('should have the Resizable size.height > 0 when openOnMode === sidePaneMode', () => {
    expect(paneContainer().find(Resizable).props().size.height).toBeGreaterThan(0)
  })

  it('should contain one div of class view-pane', () => {
    expect(paneContainer().find('div.view-pane')).toHaveLength(1)
  })
})


describe('PaneContainer mapStateToProps', () => {
  let state

  beforeEach(() => {
    state = {
      sidePaneMode: '_CONSOLE',
      paneHeight: 300,
    }
  })

  it('should have "flex" display and correct height when sidePaneMode is defined', () => {
    expect(mapStateToProps(state))
      .toEqual({
        viewPaneDisplayStyle: 'flex',
        paneHeight: 300,
        paneTitle: 'Console',
      })
  })

  it('should have "none" display and 0 height when sidePaneMode is NOT defined', () => {
    state.sidePaneMode = undefined
    expect(mapStateToProps(state))
      .toEqual({
        viewPaneDisplayStyle: 'none',
        paneHeight: 0,
        paneTitle: 'PANE MODE UNDEFINED!!',
      })
  })
})
