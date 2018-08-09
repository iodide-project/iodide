import { shallow } from 'enzyme'
import React from 'react'

import HistoryItem from '../history-item'
import EmptyPaneContents from '../empty-pane-contents'

import { HistoryPaneUnconnected, mapStateToProps } from '../history-pane'

describe('HistoryPaneUnconnected React component', () => {
  let props
  let mountedPane

  const historyPane = () => {
    if (!mountedPane) {
      mountedPane = shallow(<HistoryPaneUnconnected {...props} />)
    }
    return mountedPane
  }

  beforeEach(() => {
    props = {
      history: [{
        cellId: 0,
        lastRan: 1533078293981,
        content: 'var a = 3',
      }],
    }
    mountedPane = undefined
  })

  it('always renders one div with class history-cells', () => {
    expect(historyPane().find('div.history-cells'))
      .toHaveLength(1)
  })
  // rewrite this test.

  it('always renders one div.no-history inside history-cells when history is empty', () => {
    props.history = []
    expect(historyPane().find(EmptyPaneContents)).toHaveLength(1)
  })

  it('always renders HistoryItem inside history-cells when history is non empty', () => {
    expect(historyPane().find('div.history-cells').find(HistoryItem))
      .toHaveLength(1)
  })

  it('always renders correct number of HistoryItem inside history-cells', () => {
    props.history = [
      {
        cellId: 0,
        lastRan: 1533078293981,
        content: 'var a = 3',
      },
      {
        cellId: 1,
        lastRan: 1533078293981,
        content: 'var b = 3',
      },
    ]

    expect(historyPane().find('div.history-cells').find(HistoryItem))
      .toHaveLength(2)
  })
})

describe('HistoryPane mapStateToProps', () => {
  let state

  beforeEach(() => {
    state = {
      sidePaneMode: '_CONSOLE',
      history: [{
        cellId: 0,
        lastRan: 1533078293981,
        content: 'var a = 3',
      }],
    }
  })

  it('display=="block" if sidePaneMode=="_CONSOLE', () => {
    expect(mapStateToProps(state))
      .toEqual({
        sidePaneMode: '_CONSOLE',
        history: [{
          cellId: 0,
          lastRan: 1533078293981,
          content: 'var a = 3',
        }],
        paneDisplay: 'block',
      })
  })

  it('display=="none" if sidePaneMode!=="_CONSOLE', () => {
    state.sidePaneMode = 'not_CONSOLE'
    expect(mapStateToProps(state).paneDisplay)
      .toEqual('none')
  })
})
