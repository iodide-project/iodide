import React from 'react'
import { shallow } from 'enzyme'


import { ExternalResourceOutputUnconnected as ExternalResourceOutput } from '../external-resource-output'
import OutputContainer from '../output-container'
import OutputRow from '../output-row'
import ExternalResourceOutputHandler from '../../../../components/reps/output-handler-external-resource'

const STANDARD_NETWORK_ERROR = 'A network error occurred.'

describe('ExternalResourceOutputUnconnected contains the expected child components', () => {
  let props
  let mountedCell
  const output = () => {
    if (!mountedCell) {
      mountedCell = shallow(<ExternalResourceOutput {...props} />)
    }
    return mountedCell
  }

  beforeEach(() => {
    props = {
      cellId: 5,
      value: [
        {
          src: 'http://whatever.com/cdn/a-library.js',
          status: 'loaded',
          variables: ['a', 'b', 'c'],
        },
        {
          src: 'http://whatever.com/cdn/a-stylsheet.css',
          status: 'loaded',
        },
        {
          src: 'http://whatever.com/cdn/some-other-library.js',
          status: 'error',
          statusExplanation: STANDARD_NETWORK_ERROR,
        },
        {
          src: 'http://whatever.com/cdn/some-other-stylesheet.css',
          status: 'error',
          statusExplanation: STANDARD_NETWORK_ERROR,
        },
      ],
    }
    mountedCell = undefined
  })

  it('always renders one OutputContainer', () => {
    expect(output().find(OutputContainer).length).toBe(1)
  })

  it('always renders 1 OutputRow inside OutputContainer', () => {
    expect(output().wrap(output().find(OutputContainer))
      .find(OutputRow)).toHaveLength(1)
  })

  it('always renders one ExternalResourceOutputHandler inside 1st OutputRow', () => {
    expect(output().wrap(output().find(OutputRow).at(0))
      .find(ExternalResourceOutputHandler)).toHaveLength(1)
  })

  it("sets the OutputContainer cellId prop to be the ExternalResourceOutput's cellId prop", () => {
    expect(output().find(OutputContainer).props().cellId)
      .toBe(props.cellId)
  })

  it("sets the first OutputRow cellId prop to be the ExternalResourceOutput's cellId prop", () => {
    expect(output().find(OutputRow).at(0).props().cellId)
      .toBe(props.cellId)
  })

  it('sets the 1st OutputRow rowType prop to be output', () => {
    expect(output().find(OutputRow).at(0).props().rowType)
      .toBe('output')
  })

  it("sets the ExternalResourceOutputHandler value prop to be the ExternalResourceOutput's value prop", () => {
    expect(output().find(ExternalResourceOutputHandler).props().value)
      .toBe(props.value)
  })
})
