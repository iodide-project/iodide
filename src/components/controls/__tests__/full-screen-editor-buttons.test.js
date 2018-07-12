import { mapStateToProps, VIEWMODE_IS_REPORT, VIEWMODE_IS_NOT_REPORT } from '../full-screen-editor-buttons'

describe('mapStateToProps', () => {
  let state
  beforeEach(() => {
    state = {
      showFrame: true,
      showEditor: true,
      viewMode: 'REPORT_VIEW',
    }
  })
  it('sets the display as VIEWMODE_IS_REPORT if we are in report view', () => {
    expect(mapStateToProps(state)).toEqual({
      showFrame: true,
      showEditor: true,
      viewMode: 'REPORT_VIEW',
      display: VIEWMODE_IS_REPORT,
    })
  })
  it('sets the display as VIEWMODE_IS_NOT_REPORT if we are not in report view', () => {
    state.viewMode = 'EDITOR_VIEW'
    expect(mapStateToProps(state)).toEqual({
      showFrame: true,
      showEditor: true,
      viewMode: 'EDITOR_VIEW',
      display: VIEWMODE_IS_NOT_REPORT,
    })
  })
})
