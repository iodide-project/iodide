import { mapStateToProps, ACTIVE_SCROLLING_TEXT, INACTIVE_SCROLLING_TEXT } from '../editor-link-button'

describe('mapStateToProps', () => {
  let state
  beforeEach(() => {
    state = {
      scrollingLinked: true,
    }
  })
  it('creates the appropriate tooltipText when scrollingLinked = true', () => {
    expect(mapStateToProps(state)).toEqual({
      scrollingLinked: true,
      tooltipText: ACTIVE_SCROLLING_TEXT,
    })
  })
  it('creates the appropriate tooltipText when scrollingLink = false', () => {
    state.scrollingLinked = false
    expect(mapStateToProps(state)).toEqual({
      scrollingLinked: false,
      tooltipText: INACTIVE_SCROLLING_TEXT,
    })
  })
})
