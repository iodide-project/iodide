import { shallow } from 'enzyme'
import React from 'react'

import { LayoutManagerUnconnected, mapStateToProps } from '../layout-manager'

describe('LayoutManagerUnconnected React component', () => {
  let props
  let mountedComponent
  const childNode = <span>Hello</span>

  const testComponent = () => {
    if (!mountedComponent) {
      mountedComponent = shallow((
        <LayoutManagerUnconnected {...props}>
          {childNode}
        </LayoutManagerUnconnected>
      ))
    }
    return mountedComponent
  }

  beforeEach(() => {
    props = {
      style: {
        display: 'a string',
        top: 1,
        left: 2,
        width: 3,
        height: 4,
      },
    }
    mountedComponent = undefined
  })

  it('always renders a div', () => {
    expect(testComponent().find('div').length).toBe(1)
  })
})


describe('LayoutManagerUnconnected mapStateToProps', () => {
  let state
  beforeEach(() => {
    state = {
      viewMode: 'TEST_VIEW_MODE',
    }
  })

  it('default case', () => {
    expect(mapStateToProps(state))
      .toEqual({ viewMode: 'TEST_VIEW_MODE' })
  })
})
