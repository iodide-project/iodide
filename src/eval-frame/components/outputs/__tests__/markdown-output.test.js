import { shallow } from 'enzyme'
import React from 'react'

import { MarkdownOutputUnconnected } from '../markdown-output'
import OutputContainer from '../output-container'

describe('MarkdownOutput_unconnected react component', () => {
  let props
  let mountedCell

  const output = () => {
    if (!mountedCell) {
      mountedCell = shallow(<MarkdownOutputUnconnected {...props} />)
    }
    return mountedCell
  }

  beforeEach(() => {
    props = {
      cellId: 1,
      value: 'a _markdown_ string',
      viewMode: 'EXPLORE_VIEW',
    }
    mountedCell = undefined
  })

  it('always renders one OutputContainer', () => {
    expect(output().find(OutputContainer).length).toBe(1)
  })

  it("sets the OutputContainer cellId prop to be the MarkdownOutput's cellId prop", () => {
    expect(output().find(OutputContainer).props().cellId)
      .toBe(props.cellId)
  })

  it('div should have dangerouslySetInnerHTML', () => {
    props.value = 'html string'
    expect(output().wrap(output().find('div')).props().dangerouslySetInnerHTML)
      .toEqual({ __html: props.value })
  })
})
