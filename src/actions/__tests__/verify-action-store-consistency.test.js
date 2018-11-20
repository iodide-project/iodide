import { store } from '../../store'
import { newNotebook } from '../../editor-state-prototypes'
import * as actions from '../actions'
import { SchemaValidationError } from '../../reducers/create-validated-reducer'
import { languageDefinitions } from '../../state-schemas/language-definitions'

// the integration tests in this file DO NOT verify the correctness
// of the action creators; rather, they ensure that when the action
// creators are dispatched, the store ends up in a valid state
// according to the state schema.
// This relies on the functionality in createValidatedReducer

// note that updateCellProperties is not not tested, b/c this can introduce
// arbitrary props with arbitrary values into cells

const mockUserData = {
  name: 'name',
  avatar: 'avatar',
}

describe('make sure createValidatedReducer is checking correctly', () => {
  beforeEach(() => {
    store.dispatch(actions.resetNotebook())
  })
  it(
    'createValidatedReducer should throw an error if we pass an action that inserts an invalid state value',
    () => {
      expect(() => store.dispatch(actions.setModalState(100)))
        .toThrowError(SchemaValidationError)
    },
  )
})

describe('make sure action creators leave store in a consitent state', () => {
  beforeEach(() => {
    store.dispatch(actions.resetNotebook())
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

  it('setViewMode', () => {
    expect(() => store.dispatch(actions.setViewMode('REPORT_VIEW')))
      .not.toThrow()
  })

  it('updateInputContent', () => {
    expect(() => store.dispatch(actions.updateInputContent('test input')))
      .not.toThrow()
  })

  it('addLanguage', () => {
    expect(() => store.dispatch({
      type: 'ADD_LANGUAGE_TO_EDITOR',
      languageDefinition: languageDefinitions.js,
    }))
      .not.toThrow()
  })

  it('evaluateNotebook', () => {
    expect(() => store.dispatch(actions.evaluateNotebook()))
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

  it('toggleHelpModal', () => {
    expect(() => store.dispatch(actions.clearVariables()))
      .not.toThrow()
  })

  it('toggleEditorLink', () => {
    expect(() => store.dispatch(actions.clearVariables()))
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
