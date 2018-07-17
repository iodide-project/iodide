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
  let ownProps

  beforeEach(() => {
    state = {
      sidePaneMode: '_HISTORY',
      paneHeight: 300,
    }
    ownProps = {
      openOnMode: '_HISTORY',
    }
  })

  it('should have correct props none when openOnMode !== sidePaneMode', () => {
    ownProps.openOnMode = 'not_HISTORY'
    expect(mapStateToProps(state, ownProps))
      .toEqual({
        viewPaneDisplayStyle: 'none',
        paneHeight: 0,
      })
  })

  it('should have correct props none when openOnMode === sidePaneMode', () => {
    ownProps.openOnMode = '_HISTORY'
    expect(mapStateToProps(state, ownProps))
      .toEqual({
        viewPaneDisplayStyle: 'block',
        paneHeight: 300,
      })
  })
})
