import { store } from '../../store'
import { newNotebook } from '../../editor-state-prototypes'
import * as actions from '../actions'
import { SchemaValidationError } from '../../reducers/create-validated-reducer'
import { jsLanguageDefinition } from '../../state-schemas/mirrored-state-schema'

// the integration tests in this file DO NOT verify the correctness
// of the action creators; rather, they ensure that when the action
// creators are dispatched, the store ends up in a valid state
// according to the state schema.
// This relies on the functionality in createValidatedReducer

// note that updateCellProperties is not not tested, b/c this can introduce
// arbitrary props with arbitrary values into cells

const mockUserData = {
  accessToken: 'accessToken',
  name: 'name',
  avatar: 'avatar',
}

describe('make sure createValidatedReducer is checking correctly', () => {
  beforeEach(() => {
    store.dispatch(actions.newNotebook())
  })
  it('createValidatedReducer should throw an error if we pass an action that inserts an invalid state value', () => {
    // note that change mode must be a string
    expect(() => store.dispatch(actions.changeMode(542132)))
      .toThrowError(SchemaValidationError)
  })
  it('createValidatedReducer should throw an error if we pass an action that inserts an invalid state value', () => {
    // this inserts an invalid property into `state.cells[0]``
    expect(() => store.dispatch(actions.updateCellProperties(0, { INVALID_CELL_PROP: 0 })))
      .toThrowError(SchemaValidationError)
  })
})

describe('make sure action creators leave store in a consitent state', () => {
  beforeEach(() => {
    store.dispatch(actions.newNotebook())
  })

  it('updateAppMessages, no details', () => {
    expect(() => store.dispatch(actions.updateAppMessages({ message: 'foo' })))
      .not.toThrow()
  })
  it('updateAppMessages, with details', () => {
    expect(() => store.dispatch(actions.updateAppMessages({ message: 'foo', details: 'bat' })))
      .not.toThrow()
  })

  it('importNotebook', () => {
    expect(() => store.dispatch(actions.importNotebook(newNotebook())))
      .not.toThrow()
  })

  it('importInitialJsmd', () => {
    expect(() => store.dispatch(actions.importInitialJsmd(newNotebook())))
      .not.toThrow()
  })

  it('toggleWrapInEditors', () => {
    expect(() => store.dispatch(actions.toggleWrapInEditors()))
      .not.toThrow()
  })

  // FIXME: side effects in the reducer make these hard to test
  // it('exportNotebook', () => {
  //   expect(() => store.dispatch(actions.exportNotebook()))
  //     .not.toThrow()
  // })
  // it('exportNotebook, true', () => {
  //   expect(() => store.dispatch(actions.exportNotebook(true)))
  //     .not.toThrow()
  // })

  it('saveNotebook', () => {
    expect(() => store.dispatch(actions.saveNotebook()))
      .not.toThrow()
  })
  it('saveNotebook(false)', () => {
    expect(() => store.dispatch(actions.saveNotebook(false)))
      .not.toThrow()
  })

  it('clearVariables', () => {
    expect(() => store.dispatch(actions.clearVariables()))
      .not.toThrow()
  })

  it('changePageTitle', () => {
    expect(() => store.dispatch(actions.changePageTitle('test title')))
      .not.toThrow()
  })

  it('changeMode', () => {
    expect(() => store.dispatch(actions.changeMode('COMMAND_MODE')))
      .not.toThrow()
  })

  it('setViewMode', () => {
    expect(() => store.dispatch(actions.setViewMode('REPORT_VIEW')))
      .not.toThrow()
  })

  it('updateInputContent', () => {
    expect(() => store.dispatch(actions.updateInputContent('test input')))
      .not.toThrow()
  })

  it('changeCellType', () => {
    expect(() => store.dispatch(actions.changeCellType('code')))
      .not.toThrow()
  })

  it('changeCellType(code, language)', () => {
    expect(() => store.dispatch(actions.changeCellType('code', 'test language')))
      .not.toThrow()
  })

  it('addLanguage', () => {
    expect(() => store.dispatch({
      type: 'ADD_LANGUAGE_TO_EDITOR',
      languageDefinition: jsLanguageDefinition,
    }))
      .not.toThrow()
  })

  it('evaluateCell', () => {
    expect(() => store.dispatch(actions.evaluateCell()))
      .not.toThrow()
  })

  it('evaluateAllCells', () => {
    expect(() => store.dispatch(actions.evaluateAllCells()))
      .not.toThrow()
  })

  it('loginSuccess', () => {
    expect(() => store.dispatch(actions.loginSuccess(mockUserData)))
      .not.toThrow()
  })

  it('loginFailure', () => {
    expect(() => store.dispatch(actions.loginFailure()))
      .not.toThrow()
  })

  // FIXME: side effects in the action make these hard to test
  // it('login', () => {
  //   expect(() => store.dispatch(actions.login()))
  //     .not.toThrow()
  // })
  // it('logout', () => {
  //   expect(() => store.dispatch(actions.logout()))
  //     .not.toThrow()
  // })

  // FIXME: side effects in the action make these hard to test
  // it('cellUp', () => {
  //   expect(() => store.dispatch(actions.cellUp()))
  //     .not.toThrow()
  // })
  // it('cellDown', () => {
  //   expect(() => store.dispatch(actions.cellDown()))
  //     .not.toThrow()
  // })
  it('cellUp', () => {
    expect(() => store.dispatch({ type: 'CELL_UP' }))
      .not.toThrow()
  })
  it('cellDown', () => {
    expect(() => store.dispatch({ type: 'CELL_DOWN' }))
      .not.toThrow()
  })


  it('insertCell(code)', () => {
    expect(() => store.dispatch(actions.insertCell('code', 1)))
      .not.toThrow()
  })

  it('addCell', () => {
    expect(() => store.dispatch(actions.addCell('code')))
      .not.toThrow()
  })

  it('selectCell', () => {
    expect(() => store.dispatch({ type: 'SELECT_CELL', id: 0 }))
      .not.toThrow()
  })

  it('deleteCell', () => {
    expect(() => store.dispatch(actions.clearVariables()))
      .not.toThrow()
  })

  it('toggleHelpModal', () => {
    expect(() => store.dispatch(actions.clearVariables()))
      .not.toThrow()
  })

  it('toggleEditorLink', () => {
    expect(() => store.dispatch(actions.clearVariables()))
      .not.toThrow()
  })

  it('changeSidePaneMode', () => {
    expect(() => store.dispatch(actions.changeSidePaneMode('_CONSOLE')))
      .not.toThrow()
  })

  it('changeEditorWidth', () => {
    expect(() => store.dispatch(actions.changeEditorWidth(76)))
      .not.toThrow()
  })

  it('setCellSkipInRunAll', () => {
    expect(() => store.dispatch(actions.setCellSkipInRunAll(true)))
      .not.toThrow()
  })

  it('saveEnvironment', () => {
    expect(() => store.dispatch(actions.saveEnvironment({ a: 'foo' }, true)))
      .not.toThrow()
  })

  it('saveEnvironment', () => {
    expect(() => store.dispatch(actions.saveEnvironment({ a: 'foo' }, false)))
      .not.toThrow()
  })
})
