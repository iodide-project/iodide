import { mapStateToProps } from '../css-output'

// note: purely declarative component doesn't need testing

describe('CSSOutput_unconnected react component', () => {
})


describe('CSSOutput mapStateToProps', () => {
  const state = {
    cells: [
      { id: 5, value: 'h1 {color:pink}', rendered: true },
      { id: 3, value: 'h1 {color:blue}', rendered: false }],
  }

  it('rendered cells return correct style prop', () => {
    const ownProps = { cellId: 5 }
    expect(mapStateToProps(state, ownProps))
      .toEqual({ style: 'h1 {color:pink}' })
  })

  it('unrendered cells have empty style prop', () => {
    const ownProps = { cellId: 3 }
    expect(mapStateToProps(state, ownProps))
      .toEqual({ style: '' })
  })
})
