import { shallow } from 'enzyme'
import React from 'react'

import { DeclaredVariable } from '../declared-variable'
import { FrozenVariable } from '../frozen-variable'

import { DeclaredVariablesPaneUnconnected, mapStateToProps } from '../declared-variables-pane'

describe('DeclaredVariablesPaneUnconnected React component', () => {
  let props
  let nextProps
  let mountedPane

  const declaredVariablesPane = () => {
    if (!mountedPane) {
      mountedPane = shallow(<DeclaredVariablesPaneUnconnected {...props} />)
    }
    return mountedPane
  }

  beforeEach(() => {
    props = {
      userDefinedVarNames: ['iodide', 'a', 'b'],
      sidePaneMode: 'DECLARED_VARIABLES',
      environmentVariables: {
        x: [
          'object',
          'NobwRAhmBcCMAMj4BowCMYCYnwL7PCjngBYBmVDaTATjPNwF0g==',
        ],
        y: [
          'string',
          'JYewJsYKZA==',
        ],
      },
    }
    nextProps = {
      userDefinedVarNames: ['iodide', 'a', 'b'],
      sidePaneMode: 'DECLARED_VARIABLES',
      environmentVariables: {
        x: [
          'object',
          'NobwRAhmBcCMAMj4BowCMYCYnwL7PCjngBYBmVDaTATjPNwF0g==',
        ],
        y: [
          'string',
          'JYewJsYKZA==',
        ],
      },
    }
    mountedPane = undefined
  })

  it('always renders one SidePane', () => {
    expect(declaredVariablesPane().find('div.pane-content').length).toBe(1)
  })

  it('always renders two declared-variables-list when both variable types are non empty', () => {
    expect(declaredVariablesPane().find('div.declared-variables-list'))
      .toHaveLength(2)
  })

  it('always renders correct number of DeclaredVariable', () => {
    expect(declaredVariablesPane().find(DeclaredVariable))
      .toHaveLength(3)
  })

  it('always renders correct number of FrozenVariable', () => {
    expect(declaredVariablesPane().find(FrozenVariable))
      .toHaveLength(2)
  })

  it('never renders FrozenVariable when environmentVariables is empty', () => {
    props.environmentVariables = {}
    expect(declaredVariablesPane().find(FrozenVariable))
      .toHaveLength(0)
  })

  it('never renders DeclaredVariable when userDefinedVarNames is empty', () => {
    props.userDefinedVarNames = []
    expect(declaredVariablesPane().find(DeclaredVariable))
      .toHaveLength(0)
  })

  it('updates the component when props change and nextProps.sidePaneMode==="DECLARED_VARIABLES"', () => {
    nextProps.userDefinedVarNames = ['iodide', 'a', 'b', 'foo']
    expect(declaredVariablesPane().instance().shouldComponentUpdate(nextProps))
      .toBe(true)
  })

  it('never updates the component when props===nextProps', () => {
    expect(props)
      .toEqual(nextProps)
    expect(declaredVariablesPane().instance().shouldComponentUpdate(nextProps))
      .toBe(false)
  })

  it('never updates the component when props & nextProps have sidePaneMode!=="DECLARED_VARIABLES"', () => {
    nextProps.userDefinedVarNames = ['iodide', 'a', 'b', 'foo']
    props.sidePaneMode = 'not_DECLARED_VARIABLES'
    nextProps.sidePaneMode = 'not_DECLARED_VARIABLES'
    expect(declaredVariablesPane().instance().shouldComponentUpdate(nextProps))
      .toBe(false)
  })
})


describe('DeclaredVariablesPane mapStateToProps', () => {
  let state

  beforeEach(() => {
    state = {
      savedEnvironment: {},
      userDefinedVarNames: ['iodide', 'a'],
      sidePaneMode: 'DECLARED_VARIABLES',
    }
  })

  it('should return the correct basic info', () => {
    expect(mapStateToProps(state))
      .toEqual({
        environmentVariables: {},
        userDefinedVarNames: ['iodide', 'a'],
        sidePaneMode: 'DECLARED_VARIABLES',
        paneDisplay: 'block',
      })
  })

  it('display=="none" if sidePaneMode!=="DECLARED_VARIABLES', () => {
    state.sidePaneMode = 'not_DECLARED_VARIABLES'
    expect(mapStateToProps(state).paneDisplay)
      .toEqual('none')
  })
})
