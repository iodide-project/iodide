import React from 'react'
import { shallow } from 'enzyme'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import { ViewModeToggleButtonUnconnected } from '../view-mode-toggle-button'


describe('ViewModeToggleButtonUnconnected', () => {
  let mountedComponent
  let props

  const wrapper = () => {
    if (!mountedComponent) {
      mountedComponent = shallow(<ViewModeToggleButtonUnconnected {...props} />)
    }
    return mountedComponent
  }

  beforeEach(() => {
    props = {
      viewMode: 'REPORT_VIEW',
    }
    mountedComponent = undefined
  })

  it('should render all children', () => {
    expect(wrapper().find(Tooltip)).toHaveLength(1)
  })

  it('when viewMode !== REPORT_VIEW', () => {
    props.viewMode = 'EXPLORE_VIEW'
    const mockCallback = jest.fn()
    const button = shallow(<Button onClick={mockCallback}>Report</Button>)
    button.find('Button').simulate('click')
    expect(mockCallback).toHaveBeenCalled();
    expect(wrapper().find(Tooltip).get(0).props.title).toEqual('Go to Report view')
    expect(wrapper().find(Button).get(0).props.children).toEqual('Report')
  })

  it('when viewMode == REPORT_VIEW', () => {
    const mockCallback = jest.fn()
    const button = shallow(<Button onClick={mockCallback}>EXPLORE</Button>)
    button.find('Button').simulate('click')
    expect(mockCallback).toHaveBeenCalled();
    expect(wrapper().find(Tooltip).get(0).props.title).toEqual('Explore this notebook')
    expect(wrapper().find(Button).get(0).props.children).toEqual('Explore')
  })
})
