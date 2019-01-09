import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import { LastSavedTextUnconnected, mapStateToProps } from '../last-saved-text'
import { prettyDate } from '../../../tools/notebook-utils'


describe('LastSavedTextUnconnected', () => {
  let mountedComponent
  let props

  const wrapper = () => {
    if (!mountedComponent) {
      mountedComponent = shallow(<LastSavedTextUnconnected {...props} />)
    }
    return mountedComponent
  }

  beforeEach(() => {
    props = {
      lastSaved: undefined,
    }
    mountedComponent = undefined
  })

  it('should render all children', () => {
    expect(wrapper().find(Typography)).toHaveLength(1)
  })
})

describe('LastSavedText mapStateToProps', () => {
  let state
  beforeEach(() => {
    state = { lastSaved: undefined }
  })

  it('correct props if lastSaved is undefined', () => {
    expect(mapStateToProps(state)).toEqual({
      lastSaved: '',
    })
  })

  it('correct props if lastSaved is defined', () => {
    state.lastSaved = new Date().toISOString()
    expect(mapStateToProps(state)).toEqual({
      lastSaved: `saved ${prettyDate(state.lastSaved)}`,
    })
  })
})

