/* global it describe expect */
// import _ from 'lodash'

import { translateLegacyJsmd } from '../jsmd-tools'
import { newNotebook } from '../../editor-state-prototypes'

describe('legacy jsmd updates to viewMode', () => {
  let state
  let updatedState
  beforeEach(() => {
    state = newNotebook()
    updatedState = undefined
  })

  it('should update "presentation" to "REPORT_VIEW"', () => {
    state.viewMode = 'presentation'
    updatedState = translateLegacyJsmd(state)
    expect(updatedState.viewMode).toEqual('REPORT_VIEW')
  })
  it('should update "editor" to "EDITOR_"', () => {
    state.viewMode = 'editor'
    updatedState = translateLegacyJsmd(state)
    expect(updatedState.viewMode).toEqual('EXPLORE_VIEW')
  })
})
