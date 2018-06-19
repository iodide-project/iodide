import { shallow } from 'enzyme'
import React from 'react'

import SidePane from '../side-pane'
import HistoryItem from '../history-item'

import { HistoryPaneUnconnected, mapStateToProps } from '../history-pane'
import tasks from '../../../actions/task-definitions'

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
    expect(historyPane().find(SidePane).length).toBe(1)
  })

  it("sets the HistoryPane's openOnMode prop to be history", () => {
    expect(historyPane().find(SidePane).props().openOnMode)
      .toBe('history')
  })

  it("sets the HistoryPane's task prop to be toggleHistoryPane", () => {
    expect(historyPane().find(SidePane).props().task)
      .toBe(tasks.toggleHistoryPane)
  })

  it('always renders one div with class history-cells inside HistoryPane', () => {
    expect(historyPane().wrap(historyPane().find(SidePane))
      .find('div.history-cells')).toHaveLength(1)
  })

  it('always renders one div.no-history inside history-cells when history is empty', () => {
    props.history = []
    expect(historyPane().wrap(historyPane().find('div.history-cells'))
      .find('div.no-history')).toHaveLength(1)
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
      sidePaneMode: 'history',
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
        sidePaneMode: 'history',
        history: [{
          cellID: 0,
          lastRan: '2018-06-16T10:32:46.422Z',
          content: 'var a = 3',
        }],
      })
  })
})
