import { shallow } from 'enzyme'
import React from 'react'

import CodeMirror from '@skidding/react-codemirror'
import HistoryItem from '../history-item'

describe('HistoryItem React component', () => {
  let props
  let mountedItem

  const historyItem = () => {
    if (!mountedItem) {
      mountedItem = shallow(<HistoryItem {...props} />)
    }
    return mountedItem
  }

  beforeEach(() => {
    props = {
      cell: {
        id: 0,
        display: true,
        lastRan: new Date('2018-06-16T10:32:46.422Z'),
        content: 'var a = 3',
      },
      display: true,
    }
    mountedItem = undefined
  })

  it('always renders one div with correct class and id', () => {
    expect(historyItem().find('div.cell-container').length).toBe(1)
    expect(historyItem().find('div#cell-0').length).toBe(1)
  })

  it('always renders div with correct class when display is false', () => {
    props.display = false
    expect(historyItem().find('div.cell-container').hasClass('hidden-cell'))
      .toBe(true)
  })

  it('always renders div with correct class when display is true', () => {
    props.display = true
    expect(historyItem().find('div.cell-container').hasClass('hidden-cell'))
      .toBe(false)
  })

  it('always renders one div with classes cell and history-cell', () => {
    expect(historyItem().find('div.cell.history-cell').length)
      .toBe(1)
  })

  it('always renders one div with class history-content inside history-cell', () => {
    expect(historyItem().wrap(historyItem().find('div.history-cell'))
      .find('div.history-content')).toHaveLength(1)
  })

  it('always renders one div with class history-date inside history-cell', () => {
    expect(historyItem().wrap(historyItem().find('div.history-cell'))
      .find('div.history-date')).toHaveLength(1)
  })

  it('always renders one CodeMirror inside history-content', () => {
    expect(historyItem().wrap(historyItem().find('div.history-content'))
      .find(CodeMirror)).toHaveLength(1)
  })

  it("sets the CodeMirror's value prop to be history item's cell's content", () => {
    expect(historyItem().find(CodeMirror).props().value)
      .toBe(props.cell.content)
  })

  it('always renders one div with class cell-controls', () => {
    expect(historyItem().find('div.cell-controls').length)
      .toBe(1)
  })
})
