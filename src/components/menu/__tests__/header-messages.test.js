// import { shallow } from 'enzyme'
// import React from 'react'

import {
  // HeaderMessagesUnconnected,
  mapStateToProps,
} from '../header-messages'

// describe('HeaderMessagesUnconnected React component', () => {
//
// })

describe('CellContainer mapStateToProps', () => {
  let state
  let ownProps

  beforeEach(() => {
    state = {
      viewMode: 'EXPLORE_VIEW',
      userData: {
        name: 'user',
      },
      notebookInfo: {
        user_can_save: true,
      },
    }
    ownProps = { }
  })

  it('displays login message', () => {
    state.userData.name = undefined
    state.notebookInfo.user_can_save = false
    expect(mapStateToProps(state, ownProps).message)
      .toEqual('NEED_TO_LOGIN')
  })

  it('displays make a copy message', () => {
    state.notebookInfo.user_can_save = false
    expect(mapStateToProps(state, ownProps).message)
      .toEqual('NEED_TO_MAKE_COPY')
  })

  it('displays nothing', () => {
    expect(mapStateToProps(state, ownProps).message)
      .toEqual(undefined)
  })
})
