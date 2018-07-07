import React from 'react'
import { shallow } from 'enzyme'
import { AppInfoPaneUnconnected, mapStateToProps } from '../app-info-pane'

describe('AppInfoPane', () => {
  let props
  let mountedItem

  const appInfoPane = () => {
    if (!mountedItem) {
      mountedItem = shallow(<AppInfoPaneUnconnected {...props} />)
    }
    return mountedItem
  }

  beforeEach(() => {
    props = {
      appMessages: [
        {
          message: 'first message',
          details: 'here is additional text',
          when: new Date('2017-01-02').toString(),
          id: 0,
        },
        {
          message: 'second message message',
          details: 'here is second text',
          when: new Date('2017-01-03').toString(),
          id: 1,
        },
      ],
      sidePaneMode: '_APP_INFO',
    }
    mountedItem = undefined
  })

  it('correctly renders the two appMessages', () => {
    expect(appInfoPane().find('div.app-info-message')).toHaveLength(2)
    expect(appInfoPane().find('div.app-message-details')).toHaveLength(2)
    expect(appInfoPane().find('div.app-message-when')).toHaveLength(2)
  })
})

describe('AppInfoPane mapStateToProps', () => {
  const props = {
    appMessages: [
      {
        message: 'first message',
        details: 'here is additional text',
        when: new Date('2017-01-02').toString(),
        id: 0,
      },
      {
        message: 'second message message',
        details: 'here is second text',
        when: new Date('2017-01-03').toString(),
        id: 1,
      },
    ],
    sidePaneMode: '_APP_INFO',
  }
  it('reverses the app message order', () => {
    expect(mapStateToProps(props).appMessages.map(d => d.id)).toEqual([1, 0])
  })
  it('understands what sidePaneMode we are in', () => {
    expect(mapStateToProps(props).sidePaneMode).toBe(props.sidePaneMode)
  })
})
