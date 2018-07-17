import { shallow } from 'enzyme'
import React from 'react'

import PaneContainer from '../pane-container'
import { DeclaredVariable } from '../declared-variable'
import { FrozenVariable } from '../frozen-variable'

import { DeclaredVariablesPaneUnconnected, mapStateToProps } from '../declared-variables-pane'

describe('DeclaredVariablesPaneUnconnected React component', () => {
  let props
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
    mountedPane = undefined
  })

  it('always renders one SidePane', () => {
    expect(declaredVariablesPane().find(PaneContainer).length).toBe(1)
  })

  it("sets the HistoryPane's openOnMode prop to be history", () => {
    expect(declaredVariablesPane().find(PaneContainer).props().openOnMode)
      .toBe('DECLARED_VARIABLES')
  })

  it('always renders two declared-variables-list when both variable types are non empty', () => {
    expect(declaredVariablesPane().wrap(declaredVariablesPane().find(PaneContainer))
      .find('div.declared-variables-list')).toHaveLength(2)
  })

  it('always renders correct number of DeclaredVariable', () => {
    expect(declaredVariablesPane().wrap(declaredVariablesPane().find(PaneContainer))
      .find(DeclaredVariable)).toHaveLength(3)
  })

  it('always renders correct number of FrozenVariable', () => {
    expect(declaredVariablesPane().wrap(declaredVariablesPane().find(PaneContainer))
      .find(FrozenVariable)).toHaveLength(2)
  })

  it('never renders FrozenVariable when environmentVariables is empty', () => {
    props.environmentVariables = {}
    expect(declaredVariablesPane().wrap(declaredVariablesPane().find(FrozenVariable)))
      .toHaveLength(0)
  })

  it('never renders DeclaredVariable when userDefinedVarNames is empty', () => {
    props.userDefinedVarNames = []
    expect(declaredVariablesPane().wrap(declaredVariablesPane().find(DeclaredVariable)))
      .toHaveLength(0)
  })

  it('always updates the component when props change', () => {
    const nextProps = {
      userDefinedVarNames: ['iodide', 'a', 'b'],
      sidePaneMode: 'DECLARED_VARIABLES',
      environmentVariables: {
        x: [
          'string',
          'NobwRAhmBTATjPNwF0g==',
        ],
        y: [
          'string',
          'JYewJsYKZA==',
        ],
      },
    }
    expect(declaredVariablesPane().instance().shouldComponentUpdate(nextProps))
      .toBe(true)
  })

  it('never updates the component when props are same', () => {
    const nextProps = {
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
      })
  })
})
