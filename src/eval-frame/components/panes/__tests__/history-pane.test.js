import { shallow } from 'enzyme'
import React from 'react'

import PaneContainer from '../pane-container'
import HistoryItem from '../history-item'
import EmptyPaneContents from '../empty-pane-contents'

import { HistoryPaneUnconnected, mapStateToProps } from '../history-pane'
import tasks from '../../../actions/eval-frame-tasks'

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
        cellID: 0,
        lastRan: new Date('2018-06-16T10:32:46.422Z'),
        content: 'var a = 3',
      }],
    }
    mountedPane = undefined
  })

  it('always renders one SidePane', () => {
    expect(historyPane().find(PaneContainer).length).toBe(1)
  })

  it("sets the HistoryPane's openOnMode prop to be history", () => {
    expect(historyPane().find(PaneContainer).props().openOnMode)
      .toBe('_HISTORY')
  })

  it("sets the HistoryPane's task prop to be toggleHistoryPane", () => {
    expect(historyPane().find(PaneContainer).props().task)
      .toBe(tasks.toggleHistoryPane)
  })

  it('always renders one div with class history-cells inside HistoryPane', () => {
    expect(historyPane().wrap(historyPane().find(PaneContainer))
      .find('div.history-cells')).toHaveLength(1)
  })
  // rewrite this test.

  it('always renders one div.no-history inside history-cells when history is empty', () => {
    props.history = []
    expect(historyPane().wrap(historyPane().find(EmptyPaneContents))).toHaveLength(1)
  })

  it('always renders HistoryItem inside history-cells when history is non empty', () => {
    expect(historyPane().wrap(historyPane().find('div.history-cells'))
      .find(HistoryItem)).toHaveLength(1)
  })

  it('always renders correct number of HistoryItem inside history-cells', () => {
    props.history = [
      {
        cellID: 0,
        lastRan: new Date('2018-06-16T10:32:46.422Z'),
        content: 'var a = 3',
      },
      {
        cellID: 1,
        lastRan: new Date('2018-06-16T10:32:47.422Z'),
        content: 'var b = 3',
      },
    ]

    expect(historyPane().wrap(historyPane().find('div.history-cells'))
      .find(HistoryItem)).toHaveLength(2)
  })
})

describe('HistoryPane mapStateToProps', () => {
  let state

  beforeEach(() => {
    state = {
      sidePaneMode: '_HISTORY',
      history: [{
        cellID: 0,
        lastRan: '2018-06-16T10:32:46.422Z',
        content: 'var a = 3',
      }],
    }
  })

  it('should return the correct basic info', () => {
    expect(mapStateToProps(state))
      .toEqual({
        sidePaneMode: '_HISTORY',
        history: [{
          cellID: 0,
          lastRan: '2018-06-16T10:32:46.422Z',
          content: 'var a = 3',
        }],
      })
  })
})
