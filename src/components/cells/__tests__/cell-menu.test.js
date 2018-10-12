import { shallow } from 'enzyme'
import React from 'react'

import { CellMenuUnconnected, mapStateToProps } from '../cell-menu'
import NotebookMenuItem from '../../menu/notebook-menu-item'
import NotebookMenuDivider from '../../menu/notebook-menu-divider'

describe('CellMenuUnconnected React component', () => {
  let props
  let mountedMenu

  const cellMenu = () => {
    if (!mountedMenu) {
      mountedMenu = shallow(<CellMenuUnconnected {...props} />)
    }
    return mountedMenu
  }

  beforeEach(() => {
    props = {
      menuLabel: 'css',
      cellId: 5,
      skipInRunAll: false,
      availableLanguages: [],
    }
    mountedMenu = undefined
  })

  it('always renders one div', () => {
    expect(cellMenu().find('div').length).toBe(1)
  })

  it('sets the div to have class cell-menu-items-containe', () => {
    expect(cellMenu().find('div').props().className)
      .toBe('cell-menu-items-container')
  })

  it('always renders correct number of NotebookMenuItem without availableLanguages', () => {
    expect(cellMenu().find(NotebookMenuItem).length).toBe(13)
  })

  it('always renders one NotebookMenuDivider', () => {
    expect(cellMenu().find(NotebookMenuDivider).length).toBe(3)
  })

  const cellTypes = ['js', 'md', 'css', 'resource', 'raw', 'plugin']

  cellTypes.forEach((cellType, i) => {
    it(`sets the NotebookMenuItem disabled prop to be correct for option ${cellType}`, () => {
      expect(cellMenu().find(NotebookMenuItem).at(i).props().disabled)
        .toBe(props.menuLabel === cellType)
    })
  })
})

describe('cellMenu mapStateToProps', () => {
  let state
  beforeEach(() => {
    state = {
      cells: [{
        id: 5,
        skipInRunAll: false,
      }],
      languageDefinitions: {
        js: {
          pluginType: 'language',
          languageId: 'js',
          displayName: 'Javascript',
          codeMirrorMode: 'javascript',
          codeMirrorModeLoaded: true,
          module: 'window',
          evaluator: 'eval',
          keybinding: 'j',
          url: '',
        },
      },
    }
  })

  it('should return the basic info for the correct cell', () => {
    const ownProps = { cellId: 5 }
    expect(mapStateToProps(state, ownProps))
      .toEqual({
        skipInRunAll: false,
        availableLanguages: [],
      })
  })

  it('should return the correct availableLanguages for the cell', () => {
    const ownProps = { cellId: 5 }
    state.languageDefinitions = {
      js: {
        pluginType: 'language',
        languageId: 'js',
        displayName: 'Javascript',
        codeMirrorMode: 'javascript',
        codeMirrorModeLoaded: true,
        module: 'window',
        evaluator: 'eval',
        keybinding: 'j',
        url: '',
      },
      py: {
        pluginType: 'language',
        languageId: 'py',
        displayName: 'python',
        codeMirrorMode: 'python',
        codeMirrorModeLoaded: true,
        module: 'pyodide',
        evaluator: 'runPython',
        keybinding: 'p',
        url: 'https://iodide.io/pyodide-demo/pyodide.js',
      },
      ocaml: {
        pluginType: 'language',
        languageId: 'ocaml',
        displayName: 'OCaml',
        codeMirrorMode: 'ocaml',
        codeMirrorModeLoaded: true,
        module: 'domical',
        evaluator: 'runOcaml',
        keybinding: 'o',
        url: 'https://nowhere.com',
      },
    }
    expect(mapStateToProps(state, ownProps))
      .toEqual({
        skipInRunAll: false,
        availableLanguages: ['py', 'ocaml'],
      })
  })
})
